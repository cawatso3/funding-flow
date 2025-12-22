import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FullApplicationData,
  ETHNICITY_OPTIONS,
  GENDER_OPTIONS,
  YES_NO_PREFER_OPTIONS,
} from "@/types/applicationForm";

interface StepImpactMetricsProps {
  form: UseFormReturn<FullApplicationData>;
}

const StepImpactMetrics = ({ form }: StepImpactMetricsProps) => {
  const selectedEthnicity = form.watch("ethnicity");
  const selectedGender = form.watch("gender");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Impact Metrics</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Please answer the following questions to support mission alignment for our organization. 
          Answer these questions from the business owner(s) perspective. If there are multiple owners, 
          please answer so responses represent 50% or more of the business ownership.
        </p>
      </div>

      <div className="space-y-5">
        <FormField
          control={form.control}
          name="detroit_resident"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you a Detroit resident? *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border border-border z-50">
                  {YES_NO_PREFER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ethnicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please select your ethnicity *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border border-border z-50">
                  {ETHNICITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedEthnicity === "other" && (
          <FormField
            control={form.control}
            name="ethnicity_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please specify your ethnicity</FormLabel>
                <FormControl>
                  <Input placeholder="Please specify" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please select your gender *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border border-border z-50">
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedGender === "other" && (
          <FormField
            control={form.control}
            name="gender_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please specify your gender</FormLabel>
                <FormControl>
                  <Input placeholder="Please specify" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="is_veteran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you a Veteran? *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border border-border z-50">
                  {YES_NO_PREFER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_immigrant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you an Immigrant to the US? *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border border-border z-50">
                  {YES_NO_PREFER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_returning_citizen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you a Returning Citizen? *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border border-border z-50">
                  {YES_NO_PREFER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepImpactMetrics;
