
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep("Function started");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')
    logStep("Authorization header found");
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (userError || !user) throw new Error('Invalid user')
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 })
    let stripeCustomerId = customers.data[0]?.id
    logStep("Stripe customer check", { found: !!stripeCustomerId });

    // Check for active subscription
    let isSubscribed = false
    let subscriptionEnd = null
    let subscriptionTier = null

    if (stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'active',
        limit: 1,
      })
      
      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        isSubscribed = true
        subscriptionEnd = new Date(subscription.current_period_end * 1000)
        
        // Determine subscription tier from price if needed
        try {
          const priceId = subscription.items.data[0].price.id;
          const price = await stripe.prices.retrieve(priceId);
          const amount = price.unit_amount || 0;
          
          if (amount <= 999) {
            subscriptionTier = "Basic";
          } else if (amount <= 1999) {
            subscriptionTier = "Premium";
          } else {
            subscriptionTier = "Enterprise";
          }
          logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
        } catch (err) {
          logStep("Error determining subscription tier", { error: err.message });
          subscriptionTier = "Premium"; // Default fallback
        }
      }
    }
    
    logStep("Subscription check complete", { isSubscribed, subscriptionTier, subscriptionEnd });

    // Update Supabase subscriber record
    await supabaseClient.from('subscribers').upsert({
      user_id: user.id,
      email: user.email,
      stripe_customer_id: stripeCustomerId,
      subscribed: isSubscribed,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'email',
    })

    return new Response(
      JSON.stringify({ 
        subscribed: isSubscribed, 
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in check-subscription:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
