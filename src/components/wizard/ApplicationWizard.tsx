import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProgressIndicator from "./ProgressIndicator";
import StepApplicantInfo from "./steps/StepApplicantInfo";
import StepEligibility from "./steps/StepEligibility";
import StepImpactMetrics from "./steps/StepImpactMetrics";
import StepDeveloperExperience from "./steps/StepDeveloperExperience";
import StepDocuments from "./steps/StepDocuments";
import StepAcknowledgements from "./steps/StepAcknowledgements";
import {
  FullApplicationData,
  fullApplicationSchema,
  applicantInfoSchema,
  eligibilitySchema,
  impactMetricsSchema,
  developerExperienceSchema,
  acknowledgementsSchema,
  FORM_STEPS,
} from "@/types/applicationForm";

interface ApplicationWizardProps {
  onSuccess: () => void;
}

const stepSchemas = [
  applicantInfoSchema,
  eligibilitySchema,
  impactMetricsSchema,
  developerExperienceSchema,
  null, // Documents step - all optional
  acknowledgementsSchema,
];

const ApplicationWizard = ({ onSuccess }: ApplicationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FullApplicationData>({
    resolver: zodResolver(fullApplicationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      job_title: "",
      home_address: "",
      home_city: "",
      home_state: "",
      home_zip_code: "",
      contact_email: "",
      phone_number: "",
      has_development_firm: undefined,
      is_18_or_older: undefined,
      is_detroit_located: undefined,
      is_us_citizen_or_legal: undefined,
      bankruptcy_last_24_months: undefined,
      is_restricted_business: undefined,
      cannabis_related: undefined,
      is_elected_official: undefined,
      bipoc_majority_owned: undefined,
      previous_invest_detroit_client: undefined,
      criminal_offense: undefined,
      outstanding_judgments: undefined,
      bankruptcy_last_7_years: undefined,
      detroit_resident: "",
      ethnicity: "",
      ethnicity_other: "",
      gender: "",
      gender_other: "",
      is_veteran: "",
      is_immigrant: "",
      is_returning_citizen: "",
      years_developer_experience: 0,
      years_other_experience: 0,
      projects_completed: 0,
      project_starting_soon: undefined,
      firm_overview: null,
      one_pager: null,
      team_bios: null,
      project_budget: null,
      project_timeline: null,
      acknowledgement_truthful: false,
      acknowledgement_not_guaranteed: false,
      acknowledgement_authorize: false,
    },
    mode: "onChange",
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    const schema = stepSchemas[currentStep - 1];
    if (!schema) return true; // Documents step

    const stepFields = Object.keys(schema.shape) as (keyof FullApplicationData)[];
    const result = await form.trigger(stepFields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < FORM_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: FullApplicationData) => {
    setIsSubmitting(true);

    try {
      // Build payload without file objects (files would need separate handling)
      const payload = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        job_title: data.job_title?.trim() || null,
        home_address: data.home_address?.trim() || null,
        home_city: data.home_city?.trim() || null,
        home_state: data.home_state || null,
        home_zip_code: data.home_zip_code || null,
        contact_email: data.contact_email.trim().toLowerCase(),
        phone_number: data.phone_number.trim(),
        has_development_firm: data.has_development_firm,
        is_18_or_older: data.is_18_or_older,
        is_detroit_located: data.is_detroit_located,
        is_us_citizen_or_legal: data.is_us_citizen_or_legal,
        bankruptcy_last_24_months: data.bankruptcy_last_24_months,
        is_restricted_business: data.is_restricted_business,
        cannabis_related: data.cannabis_related,
        is_elected_official: data.is_elected_official,
        bipoc_majority_owned: data.bipoc_majority_owned,
        previous_invest_detroit_client: data.previous_invest_detroit_client,
        criminal_offense: data.criminal_offense,
        outstanding_judgments: data.outstanding_judgments,
        bankruptcy_last_7_years: data.bankruptcy_last_7_years,
        detroit_resident: data.detroit_resident,
        ethnicity: data.ethnicity,
        ethnicity_other: data.ethnicity_other || null,
        gender: data.gender,
        gender_other: data.gender_other || null,
        is_veteran: data.is_veteran,
        is_immigrant: data.is_immigrant,
        is_returning_citizen: data.is_returning_citizen,
        years_developer_experience: data.years_developer_experience,
        years_other_experience: data.years_other_experience,
        projects_completed: data.projects_completed,
        project_starting_soon: data.project_starting_soon,
        acknowledgement_truthful: data.acknowledgement_truthful,
        acknowledgement_not_guaranteed: data.acknowledgement_not_guaranteed,
        acknowledgement_authorize: data.acknowledgement_authorize,
        // File names for reference (actual file upload would need storage integration)
        firm_overview_filename: data.firm_overview?.name || null,
        one_pager_filename: data.one_pager?.name || null,
        team_bios_filename: data.team_bios?.name || null,
        project_budget_filename: data.project_budget?.name || null,
        project_timeline_filename: data.project_timeline?.name || null,
        submitted_at: new Date().toISOString(),
      };

      const { data: responseData, error } = await supabase.functions.invoke("intake-submission", {
        body: payload,
      });

      if (error) {
        console.error("Submission error:", error);
        throw new Error(error.message || "Failed to submit application");
      }

      if (!responseData?.ok) {
        throw new Error(responseData?.error || "Failed to submit application");
      }

      console.log("Application submitted successfully:", responseData);
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Error",
        description: "We couldn't submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepApplicantInfo form={form} />;
      case 2:
        return <StepEligibility form={form} />;
      case 3:
        return <StepImpactMetrics form={form} />;
      case 4:
        return <StepDeveloperExperience form={form} />;
      case 5:
        return <StepDocuments form={form} />;
      case 6:
        return <StepAcknowledgements form={form} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === FORM_STEPS.length;

  return (
    <div className="w-full">
      <ProgressIndicator currentStep={currentStep} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="min-h-[400px]">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {!isLastStep ? (
              <Button type="button" onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[140px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApplicationWizard;
