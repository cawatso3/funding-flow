import { UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FullApplicationData } from "@/types/applicationForm";
import { AlertTriangle } from "lucide-react";

interface StepEligibilityProps {
  form: UseFormReturn<FullApplicationData>;
}

interface EligibilityQuestionProps {
  form: UseFormReturn<FullApplicationData>;
  name: keyof FullApplicationData;
  label: string;
  warningValue?: "yes" | "no";
  warningMessage?: string;
}

const EligibilityQuestion = ({ form, name, label, warningValue, warningMessage }: EligibilityQuestionProps) => {
  const currentValue = form.watch(name);
  const showWarning = warningValue && currentValue === warningValue;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="p-4 rounded-lg border border-border bg-card/50 space-y-3">
          <FormLabel className="text-sm leading-relaxed">{label} *</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value as string}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${name}_yes`} />
                <label htmlFor={`${name}_yes`} className="text-sm font-medium cursor-pointer">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${name}_no`} />
                <label htmlFor={`${name}_no`} className="text-sm font-medium cursor-pointer">
                  No
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          {showWarning && warningMessage && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const StepEligibility = ({ form }: StepEligibilityProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Eligibility Questions</h3>
        <p className="text-sm text-muted-foreground">
          Please answer all questions below to determine your eligibility.
        </p>
      </div>

      <div className="space-y-4">
        <EligibilityQuestion
          form={form}
          name="is_18_or_older"
          label="Are you 18 years of age or older?"
          warningValue="no"
          warningMessage="Applicants must be 18 years or older to apply."
        />

        <EligibilityQuestion
          form={form}
          name="is_detroit_located"
          label="Is your business/development firm currently located (or will be located) within the city limits of the City of Detroit (not including Highland Park or Hamtramck)?"
          warningValue="no"
          warningMessage="Your business must be located within Detroit city limits."
        />

        <EligibilityQuestion
          form={form}
          name="is_us_citizen_or_legal"
          label="Are you a citizen of the US or have legal immigration status?"
          warningValue="no"
          warningMessage="US citizenship or legal immigration status is required."
        />

        <EligibilityQuestion
          form={form}
          name="bankruptcy_last_24_months"
          label="Have you filed for bankruptcy or had a bankruptcy discharge in the last 24 months?"
          warningValue="yes"
          warningMessage="Recent bankruptcy may affect your eligibility."
        />

        <EligibilityQuestion
          form={form}
          name="is_restricted_business"
          label="Is your business an adult entertainment, firearm dealer, or associated with cash advances and/or payday loans?"
          warningValue="yes"
          warningMessage="These business types are not eligible for this program."
        />

        <EligibilityQuestion
          form={form}
          name="cannabis_related"
          label="Do you or any of your businesses or properties engage in the growing, sale, distribution, or handling of cannabis-related items, including CBD products?"
          warningValue="yes"
          warningMessage="Cannabis-related businesses are not eligible for this program."
        />

        <EligibilityQuestion
          form={form}
          name="is_elected_official"
          label="Are you an elected official (currently) or have filed to run for current political office (local, state, federal)?"
        />

        <EligibilityQuestion
          form={form}
          name="bipoc_majority_owned"
          label="Is your development firm majority owned/lead by BIPOC leaders?"
        />

        <EligibilityQuestion
          form={form}
          name="previous_invest_detroit_client"
          label="Are you or a majority owner of the business a previous client, or have you ever applied for a loan from Invest Detroit?"
        />

        <EligibilityQuestion
          form={form}
          name="criminal_offense"
          label="Has any owner(s) been charged with or convicted of any criminal offense?"
        />

        <EligibilityQuestion
          form={form}
          name="outstanding_judgments"
          label="Are there any outstanding judgments, tax liens, garnishments, child support payments, or other legal proceedings against the business, owner(s), officer(s), or partner(s)?"
        />

        <EligibilityQuestion
          form={form}
          name="bankruptcy_last_7_years"
          label="Have any owner(s) had a bankruptcy in the last 7 years?"
          warningValue="yes"
          warningMessage="Bankruptcy history may affect your eligibility."
        />
      </div>
    </div>
  );
};

export default StepEligibility;
