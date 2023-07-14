// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0-rc.12'
import OpenAi from './openai.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const openai = new OpenAi(OPENAI_API_KEY);

const errorResponse = (error: any) => {
  return new Response(JSON.stringify({ error: error.message }), {
    headers: { 'Content-Type': 'application/json' },
    status: 400,
  });
};

serve(async (req) => {
  try{
    const { prompt } = await req.json();
    
    // init supabase client
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // fetch user auth data
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (!user || userError) return errorResponse(userError);

    // fetch user profile data
    const { data: profileDatas, error: profileError } = await supabaseClient
      .from("profile")
      .select()
      .eq("id", user.id);
    if (profileDatas.length == 0 || profileError) return errorResponse({ message: "Profile Error: " + profileError });
    const profileData = profileDatas[0];

    // need to check if subscribed or is under daily limit
    if (!profileData.isSubscribed) {
      const currentTime = new Date(Date.now());
      const userResetTime = new Date(profileData.reset_time);

      console.log(currentTime.getTime(), userResetTime.getTime(), currentTime.getTime() >= userResetTime.getTime(), profileData.daily_uses)

      if (currentTime.getTime() >= userResetTime.getTime()) {
        // update reset time 
        var newTime = currentTime;
        newTime.setDate(newTime.getDate() + 1);

        const { error: dbUpdateError } = await supabaseClient
          .from("profile")
          .update({ reset_time: newTime.toISOString() })
          .eq("id", user.id);
      
        if (dbUpdateError) return errorResponse({ message: "DBUpdate Error (reset_time): " + dbUpdateError });

        profileData.reset_time = newTime.toISOString();
      }
      else if (profileData.daily_uses > 0) {
        // update daily limit
        const { error: dbUpdateError } = await supabaseClient
          .from("profile")
          .update({ daily_uses: profileData.daily_uses - 1 })
          .eq("id", user.id);

        if (dbUpdateError) return errorResponse({ message: "DBUpdate Error (daily_uses): " + dbUpdateError });
        
        profileData.daily_uses -= 1;
      }
      else return errorResponse({ message: "Not subbed and out of daily uses" });
    }

    // generate ai response to prompt
    const completion = await openai.request(prompt);
    const data = {
      response: completion.choices,
    }

    // return response
    return new Response(
      JSON.stringify({ data, user, profileData }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
