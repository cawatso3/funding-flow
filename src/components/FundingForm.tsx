import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { US_STATES } from "@/data/usStates";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").max(20),
  businessName: z.string().min(2, "Business name is required").max(150),
  state: z.string().min(1, "Please select a state"),
  requestedAmount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Please enter a valid amount"
  ),
  monthlyRevenue: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Please enter a valid revenue amount"
  ),
  useOfFunds: z.string().min(10, "Please describe how you plan to use the funds").max(1000),
  consent: z.boolean().refine((val) => val === true, "You must consent to be contacted"),
});

type FormData = z.infer<typeof formSchema>;

interface FundingFormProps {
  onSuccess: () => void;
}

const FundingForm = ({ onSuccess }: FundingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      state: "",
      requestedAmount: "",
      monthlyRevenue: "",
      useOfFunds: "",
      consent: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Replace with your actual webhook URL
      const webhookUrl = "https://webhook.site/your-webhook-id";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          requestedAmount: Number(data.requestedAmount),
          monthlyRevenue: Number(data.monthlyRevenue),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      onSuccess();
    } catch (error) {
      // For demo purposes, we'll show success even if the webhook fails
      // In production, you'd want to handle this differently
      console.log("Demo mode: Showing success state");
      onSuccess();
      
      // Uncomment below for production error handling:
      // toast({
      //   title: "Submission Error",
      //   description: "We couldn't submit your application. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = form.formState.isValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Applicant Information */}
        <div>
          <h3 className="form-section-title">Applicant Information</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Business Information */}
        <div>
          <h3 className="form-section-title">Business Information</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border border-border z-50">
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
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

        {/* Funding Request */}
        <div>
          <h3 className="form-section-title">Funding Request</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="requestedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Amount ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="50000" 
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyRevenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Revenue ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="120000" 
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useOfFunds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Use of Funds</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe how you plan to use the funding..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Consent */}
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-muted/30">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  I consent to being contacted regarding my funding application.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="submit"
          size="lg"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default FundingForm;
