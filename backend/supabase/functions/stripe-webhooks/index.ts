// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@9.6.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.5";

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_TEST_KEY'), {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  httpClient: Stripe.createFetchHttpClient(),
})
const cryptoProvider = Stripe.createSubtleCryptoProvider()

console.log(`Function "stripe-webhooks" up and running!`);

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");

  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.
  const body = await req.text();

  let receivedEvent;
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_SIGNING_TEST_SECRET"),
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error(err.message)
    return new Response(err.message, { status: 400 });
  }
  console.log(`🔔 Event received: ${receivedEvent.id}`);

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Secondly, we use this event to query the Stripe API in order to avoid
  // handling any forged event. If available, we use the idempotency key.
  const requestOptions =
    receivedEvent.request && receivedEvent.request.idempotency_key
      ? {
          idempotencyKey: receivedEvent.request.idempotency_key,
        }
      : {};

  let retrievedEvent;
  try {
    retrievedEvent = await stripe.events.retrieve(
      receivedEvent.id,
      requestOptions
    );
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }

  console.log(`🔔 Event was of type: ${retrievedEvent.type}`);
  const subscription = retrievedEvent.data.object;

  switch (retrievedEvent.type) {
    case "customer.subscription.deleted":
      await supabaseClient
        .from("profile")
        .update({
          is_subscribed: false,
        })
        .match({ stripe_customer_id: subscription.customer });
      // Then define and call a function to handle the retrievedEvent customer.subscription.deleted
      break;
    case "customer.subscription.updated": case "customer.subscription.created":
      const product = await stripe.products.retrieve(subscription.plan.product);
      await supabaseClient
        .from("profile")
        .update({
          is_subscribed: true,
        })
        .match({ stripe_customer_id: subscription.customer });
      // Then define and call a function to handle the retrievedEvent customer.subscription.updated
      break;
    // ... handle other retrievedEvent types
    default:
      console.log(`Unhandled retrievedEvent type ${retrievedEvent.type}`);
  }

  return new Response(JSON.stringify({ id: retrievedEvent.id, status: "ok" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
