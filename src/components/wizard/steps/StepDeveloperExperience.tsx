import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FullApplicationData } from "@/types/applicationForm";

interface StepDeveloperExperienceProps {
  form: UseFormReturn<FullApplicationData>;
}

const StepDeveloperExperience = ({ form }: StepDeveloperExperienceProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Developer Experience</h3>
        <p className="text-sm text-muted-foreground">
          Tell us about your experience as a real estate developer.
        </p>
      </div>

      <div className="space-y-5">
        <FormField
          control={form.control}
          name="years_developer_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many years of experience as a developer do you have? *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  placeholder="0"
                  value={field.value === 0 || field.value === undefined ? '' : field.value}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>Enter a number between 0 and 60</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="years_other_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How many years of other relevant experience do you have (in addition to experience as a developer)? *
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  placeholder="0"
                  value={field.value === 0 || field.value === undefined ? '' : field.value}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>Enter a number between 0 and 60</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projects_completed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many projects have you completed and/or have in progress? *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={999}
                  placeholder="0"
                  value={field.value === 0 || field.value === undefined ? '' : field.value}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>Enter a number between 0 and 999</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_starting_soon"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you have at least one project that can begin in the next 12 months? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="project_soon_yes" />
                    <label htmlFor="project_soon_yes" className="text-sm font-medium cursor-pointer">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="project_soon_no" />
                    <label htmlFor="project_soon_no" className="text-sm font-medium cursor-pointer">
                      No
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepDeveloperExperience;
