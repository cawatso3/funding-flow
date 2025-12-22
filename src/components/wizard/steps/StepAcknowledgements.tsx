import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FullApplicationData } from "@/types/applicationForm";

interface StepAcknowledgementsProps {
  form: UseFormReturn<FullApplicationData>;
}

const StepAcknowledgements = ({ form }: StepAcknowledgementsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Acknowledgements</h3>
        <p className="text-sm text-muted-foreground">
          Please review and agree to the following statements to complete your application.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="acknowledgement_truthful"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-card/50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer leading-relaxed">
                  By submitting this application, I agree that the information included is truthful and accurate 
                  to the best of my knowledge. *
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acknowledgement_not_guaranteed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-card/50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer leading-relaxed">
                  I understand that by submitting this information I am only being considered for a loan and am not 
                  guaranteed any kind of financing. I understand that I am expected to provide information as requested 
                  by Invest Detroit and the Ebiara Team in a timely manner as part of the lending review, underwriting 
                  and approval process. *
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acknowledgement_authorize"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-card/50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer leading-relaxed">
                  I authorize Invest Detroit, the Ebiara Developer Fund I LLC and any of the funds, affiliates, or agents 
                  associated therewith to make any credit or due diligence investigations necessary to evaluate and 
                  underwrite an application for a loan. *
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Compliance Notice */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          In accordance with federal laws and U.S. Department of the Treasury policy, this organization is prohibited 
          from discriminating on the basis of race, color, national origin, sex, age, or disability. To file a complaint 
          of discrimination, write to: U.S. Department of the Treasury, Director, Office of Civil Rights and Equal 
          Employment Opportunity 1500 Pennsylvania Avenue, N.W., Washington, DC 20220; call (202) 622-1160; or send 
          an e-mail to: crcomplaints@treasury.gov
        </p>
      </div>
    </div>
  );
};

export default StepAcknowledgements;
