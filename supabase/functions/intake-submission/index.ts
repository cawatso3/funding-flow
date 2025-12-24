import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const N8N_WEBHOOK_URL = "https://n8n.coreorangelabs.com/webhook-test/intake-submission";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await req.json();
    console.log('Received form submission:', JSON.stringify(formData, null, 2));

    const webhookToken = Deno.env.get('N8N_WEBHOOK_TOKEN');
    if (!webhookToken) {
      console.error('N8N_WEBHOOK_TOKEN not configured');
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'Webhook configuration error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Forwarding to n8n webhook...');
    
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookToken}`,
      },
      body: JSON.stringify(formData),
    });

    const responseText = await n8nResponse.text();
    console.log('n8n response status:', n8nResponse.status);
    console.log('n8n response body:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { 
        ok: n8nResponse.ok, 
        message: responseText || 'Application received.' 
      };
    }

    if (!n8nResponse.ok) {
      console.error('n8n webhook error:', responseData);
      return new Response(JSON.stringify({ 
        ok: false, 
        error: 'Failed to process application' 
      }), {
        status: n8nResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      correlationId: responseData.correlationId || null,
      message: responseData.message || 'Application received.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in intake-submission function:', error);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
