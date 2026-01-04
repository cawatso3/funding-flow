import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const N8N_WEBHOOK_URL = "https://n8n.coreorangelabs.com/webhook/intake-submission";

// Expected payload structure matching FundingForm.tsx fields
interface IntakeSubmissionPayload {
  // Section 1: Applicant Information
  first_name: string;
  last_name: string;
  job_title?: string;
  business_name: string;
  amount_requested: number;
  home_address?: string;
  home_city?: string;
  home_state?: string;
  home_zip_code?: string;
  contact_email: string;
  phone_number: string;
  has_development_firm: "Yes" | "No";

  // Section 2: Eligibility Questions
  is_18_or_older: "Yes" | "No";
  firm_located_detroit: "Yes" | "No";
  legal_status_us: "Yes" | "No";
  bankruptcy_last_24_months: "Yes" | "No";
  adult_entertainment_firearm_payday: "Yes" | "No";
  cannabis_related: "Yes" | "No";
  elected_official_or_candidate: "Yes" | "No";
  bipoc_led: "Yes" | "No";
  previous_invest_detroit_client_or_applicant: "Yes" | "No";
  owner_criminal_offense: "Yes" | "No";
  outstanding_judgments_or_liens: "Yes" | "No";
  owners_bankruptcy_last_7_years: "Yes" | "No";

  // Section 3: Impact Metrics
  detroit_resident: string;
  ethnicity: string;
  ethnicity_other?: string;
  gender: string;
  gender_self_describe?: string;
  veteran: string;
  immigrant_to_us: string;
  returning_citizen: string;

  // Section 4: Developer Experience
  years_dev_experience: number;
  years_other_experience: number;
  projects_completed_or_in_progress: number;
  has_project_next_12_months: "Yes" | "No";

  // Section 5: Supporting Documents (file names when uploaded)
  firm_overview_growth_strategy?: string;
  one_pager_projects?: string;
  team_bios_resumes?: string;
  upcoming_project_budget_sources_uses?: string;
  upcoming_project_development_timeline?: string;

  // Section 6: Acknowledgements
  ack_truthful: boolean;
  ack_not_guaranteed: boolean;
  ack_authorize_credit: boolean;

  // Auto-generated
  submitted_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await req.json();

    // Add timestamp if not present
    const payload = {
      ...formData,
      submitted_at: formData.submitted_at || new Date().toISOString(),
    };

    console.log("Received intake submission:", JSON.stringify(payload, null, 2));

    // Create Basic Auth credentials from environment secrets
    const username = Deno.env.get('N8N_AUTH_USERNAME') || '';
    const password = Deno.env.get('N8N_AUTH_PASSWORD') || '';
    const credentials = btoa(`${username}:${password}`);

    console.log("Forwarding to n8n webhook...");

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await n8nResponse.text();
    console.log("n8n response status:", n8nResponse.status);
    console.log("n8n response body:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = {
        ok: n8nResponse.ok,
        message: responseText || "Application received.",
      };
    }

    if (!n8nResponse.ok) {
      console.error("n8n webhook error:", responseData);
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Failed to process application",
        }),
        {
          status: n8nResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        correlationId: responseData.correlationId || null,
        message: responseData.message || "Application received.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in intake-submission function:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
