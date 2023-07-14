// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@10.13.0?target=deno&deno-std=0.132.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.6'
import { corsHeaders } from "../_utils/cors.ts"

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_TEST_KEY'), {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  httpClient: Stripe.createFetchHttpClient(),
})

console.log(`Function "stripe-create-checkout-session" up and running!`);

const errorResponse = (error: any) => {
  return new Response(JSON.stringify({ error: error.message }), {
    headers: { 'Content-Type': 'application/json' },
    status: 400,
  });
};

serve(async (req) => {
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

  const { data: profileDatas, error: profileError } = await supabaseClient
    .from("profile")
    .select()
    .eq("id", user.id);
  if (!profileDatas || profileDatas.length == 0 || profileError) return errorResponse({ message: "Profile Error: " + profileError });
  const profileData = profileDatas[0];

  const lineItems = [
    {
      price: Deno.env.get('STRIPE_SUBSCRIPTION_TEST_PROD_ID'), // Pro subscription ID
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    customer: profileData.stripe_customer_id,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/questions",
  });

  return new Response(
    JSON.stringify(session),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
