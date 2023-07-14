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

console.log(`Function "stripe-create-customer" up and running!`);

serve(async (req) => {
  const d = await req.json();
  const { record } = d;
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  
  console.log(d);

  const customer = await stripe.customers.create({
    name: record.phone,
    phone: record.phone,
  });

  const { error: dbError } = await supabaseClient
    .from("profile")
    .update({ stripe_customer_id: customer.id })
    .eq("id", record.id);
  
  if (dbError) throw dbError;

  console.log(customer);

  return new Response(
    JSON.stringify({ message: `stripe customer created: ${customer.id}` }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
