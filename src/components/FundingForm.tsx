import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// n8n Webhook Configuration
const N8N_WEBHOOK_URL = "https://n8n.coreorangelabs.com/webhook/intake-submission";
const N8N_AUTH_USERNAME = import.meta.env.VITE_N8N_AUTH_USERNAME || "";
const N8N_AUTH_PASSWORD = import.meta.env.VITE_N8N_AUTH_PASSWORD || "";

// Options data
const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" }, { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" }, { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" }, { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" }, { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" }, { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" }, { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" }, { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" }, { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" }, { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" }, { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" }, { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" }, { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" }, { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" }, { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" }, { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" }, { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" }, { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
];

const YES_NO = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const YES_NO_PREFER = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const ETHNICITY_OPTIONS = [
  { value: "American Indian or Alaska Native", label: "American Indian or Alaska Native" },
  { value: "Asian", label: "Asian" },
  { value: "Black or African American", label: "Black or African American" },
  { value: "Hispanic or Latino", label: "Hispanic or Latino" },
  { value: "Native Hawaiian or Other Pacific Islander", label: "Native Hawaiian or Other Pacific Islander" },
  { value: "Middle Eastern or North African", label: "Middle Eastern or North African" },
  { value: "White", label: "White" },
  { value: "Two or more races", label: "Two or more races" },
  { value: "Other", label: "Other (please specify)" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const GENDER_OPTIONS = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Non-binary", label: "Non-binary" },
  { value: "Transgender", label: "Transgender" },
  { value: "Prefer to self-describe", label: "Prefer to self-describe" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

// Form schema with all fields
const formSchema = z.object({
  // Section 1: Applicant Information
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  job_title: z.string().optional(),
  business_name: z.string().min(1, "Business name is required"),
  amount_requested: z.number().min(1, "Amount requested is required").max(10000000, "Amount cannot exceed $10,000,000"),
  home_address: z.string().optional(),
  home_city: z.string().optional(),
  home_state: z.string().optional(),
  home_zip_code: z.string().regex(/^\d{5}$/, "Enter a 5-digit ZIP code").optional().or(z.literal("")),
  contact_email: z.string().email("Please enter a valid email address"),
  phone_number: z.string().regex(/^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, "Enter a valid US phone number"),
  has_development_firm: z.enum(["Yes", "No"], { required_error: "Please select an option" }),

  // Section 2: Eligibility Questions
  is_18_or_older: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  firm_located_detroit: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  legal_status_us: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  bankruptcy_last_24_months: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  adult_entertainment_firearm_payday: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  cannabis_related: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  elected_official_or_candidate: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  bipoc_led: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  previous_invest_detroit_client_or_applicant: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  owner_criminal_offense: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  outstanding_judgments_or_liens: z.enum(["Yes", "No"], { required_error: "Please select an option" }),
  owners_bankruptcy_last_7_years: z.enum(["Yes", "No"], { required_error: "Please select an option" }),

  // Section 3: Impact Metrics
  detroit_resident: z.string().min(1, "Please select an option"),
  ethnicity: z.string().min(1, "Please select an option"),
  gender: z.string().min(1, "Please select an option"),
  veteran: z.string().min(1, "Please select an option"),
  immigrant_to_us: z.string().min(1, "Please select an option"),
  returning_citizen: z.string().min(1, "Please select an option"),
  ethnicity_other: z.string().optional(),
  gender_self_describe: z.string().optional(),

  // Section 4: Developer Experience
  years_dev_experience: z.number().min(0).max(60),
  years_other_experience: z.number().min(0).max(60),
  projects_completed_or_in_progress: z.number().min(0).max(999),
  has_project_next_12_months: z.enum(["Yes", "No"], { required_error: "Please select an option" }),

  // Section 5: Supporting Documents (optional file uploads - handled separately)

  // Section 6: Acknowledgements
  ack_truthful: z.boolean().refine((val) => val === true, "You must agree to this acknowledgement"),
  ack_not_guaranteed: z.boolean().refine((val) => val === true, "You must agree to this acknowledgement"),
  ack_authorize_credit: z.boolean().refine((val) => val === true, "You must agree to this acknowledgement"),
});

type FormData = z.infer<typeof formSchema>;

interface FundingFormProps {
  onSuccess: () => void;
}

const SECTIONS = [
  { id: "applicant_info", title: "Applicant Information", description: "Basic applicant contact + firm details." },
  { id: "eligibility", title: "Eligibility Questions", description: "Required Yes/No questions used to determine eligibility." },
  { id: "impact_metrics", title: "Impact Metrics", description: "Mission alignment and demographic metrics." },
  { id: "developer_experience", title: "Developer Experience", description: "Experience and near-term project readiness." },
  { id: "supporting_documents", title: "Supporting Documents", description: "Optional uploads (encouraged)." },
  { id: "acknowledgements", title: "Acknowledgements", description: "Required consents + compliance notice." },
];

const FundingForm = ({ onSuccess }: FundingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({
    firm_overview_growth_strategy: null,
    one_pager_projects: null,
    team_bios_resumes: null,
    upcoming_project_budget_sources_uses: null,
    upcoming_project_development_timeline: null,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      job_title: "",
      business_name: "",
      amount_requested: 0,
      home_address: "",
      home_city: "",
      home_state: "",
      home_zip_code: "",
      contact_email: "",
      phone_number: "",
      has_development_firm: undefined,
      is_18_or_older: undefined,
      firm_located_detroit: undefined,
      legal_status_us: undefined,
      bankruptcy_last_24_months: undefined,
      adult_entertainment_firearm_payday: undefined,
      cannabis_related: undefined,
      elected_official_or_candidate: undefined,
      bipoc_led: undefined,
      previous_invest_detroit_client_or_applicant: undefined,
      owner_criminal_offense: undefined,
      outstanding_judgments_or_liens: undefined,
      owners_bankruptcy_last_7_years: undefined,
      detroit_resident: "",
      ethnicity: "",
      gender: "",
      veteran: "",
      immigrant_to_us: "",
      returning_citizen: "",
      ethnicity_other: "",
      gender_self_describe: "",
      years_dev_experience: 0,
      years_other_experience: 0,
      projects_completed_or_in_progress: 0,
      has_project_next_12_months: undefined,
      ack_truthful: false,
      ack_not_guaranteed: false,
      ack_authorize_credit: false,
    },
    mode: "onChange",
  });

  const watchEthnicity = form.watch("ethnicity");
  const watchGender = form.watch("gender");

  const handleFileChange = (fieldName: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Add files
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      // Build headers
      const headers: HeadersInit = {};
      if (N8N_AUTH_USERNAME && N8N_AUTH_PASSWORD) {
        const credentials = btoa(`${N8N_AUTH_USERNAME}:${N8N_AUTH_PASSWORD}`);
        headers["Authorization"] = `Basic ${credentials}`;
      }

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers,
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to submit application");
      }

      toast({
        title: "Application Submitted!",
        description: `Your reference ID is: ${responseData.correlationId}`,
      });

      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "We couldn't submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < SECTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / SECTIONS.length) * 100;

  const RadioField = ({ name, label, options }: { name: keyof FormData; label: string; options: { value: string; label: string }[] }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value as string}
              className="flex flex-row gap-6"
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${String(name)}-${option.value}`} />
                  <label htmlFor={`${String(name)}-${option.value}`} className="text-sm font-normal cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const SelectField = ({ name, label, options, placeholder = "Please select..." }: { name: keyof FormData; label: string; options: { value: string; label: string }[]; placeholder?: string }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value as string}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const FileUploadField = ({ name, label }: { name: string; label: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={(e) => handleFileChange(name, e.target.files?.[0] || null)}
          className="flex-1"
        />
        {uploadedFiles[name] && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleFileChange(name, null)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {uploadedFiles[name] && (
        <p className="text-xs text-muted-foreground">
          Uploaded: {uploadedFiles[name]?.name}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {SECTIONS.length}</span>
          <span className="text-sm font-medium">{SECTIONS[currentStep].title}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{SECTIONS[currentStep].title}</CardTitle>
              <CardDescription>{SECTIONS[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section 1: Applicant Information */}
              {currentStep === 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Development LLC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount_requested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount Requested ($) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="50000" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Real Estate Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="home_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="home_city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Detroit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <SelectField name="home_state" label="State" options={US_STATES} placeholder="Select state" />
                    <FormField
                      control={form.control}
                      name="home_zip_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="48201" maxLength={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <RadioField name="has_development_firm" label="Do you have a development firm? *" options={YES_NO} />
                </>
              )}

              {/* Section 2: Eligibility Questions */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <RadioField name="is_18_or_older" label="Are you 18 years of age or older? *" options={YES_NO} />
                  <RadioField name="firm_located_detroit" label="Is your firm located in the City of Detroit city limits (excluding Highland Park or Hamtramck)? *" options={YES_NO} />
                  <RadioField name="legal_status_us" label="Are you a US citizen or legal resident? *" options={YES_NO} />
                  <RadioField name="bankruptcy_last_24_months" label="Have you filed for bankruptcy in the last 24 months? *" options={YES_NO} />
                  <RadioField name="adult_entertainment_firearm_payday" label="Is your business related to adult entertainment, firearm sales, or payday lending? *" options={YES_NO} />
                  <RadioField name="cannabis_related" label="Is your business cannabis-related? *" options={YES_NO} />
                  <RadioField name="elected_official_or_candidate" label="Are you an elected official or candidate for public office? *" options={YES_NO} />
                  <RadioField name="bipoc_led" label="Is your business majority BIPOC-owned? *" options={YES_NO} />
                  <RadioField name="previous_invest_detroit_client_or_applicant" label="Have you been a previous Invest Detroit client or applicant? *" options={YES_NO} />
                  <RadioField name="owner_criminal_offense" label="Have any owners been convicted of a criminal offense? *" options={YES_NO} />
                  <RadioField name="outstanding_judgments_or_liens" label="Are there any outstanding judgments or liens against you or your business? *" options={YES_NO} />
                  <RadioField name="owners_bankruptcy_last_7_years" label="Have any owners filed for bankruptcy in the last 7 years? *" options={YES_NO} />
                </div>
              )}

              {/* Section 3: Impact Metrics */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <SelectField name="detroit_resident" label="Are you a Detroit resident? *" options={YES_NO_PREFER} />
                  <SelectField name="ethnicity" label="What is your ethnicity? *" options={ETHNICITY_OPTIONS} />
                  {watchEthnicity === "Other" && (
                    <FormField
                      control={form.control}
                      name="ethnicity_other"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify ethnicity</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter ethnicity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <SelectField name="gender" label="What is your gender? *" options={GENDER_OPTIONS} />
                  {watchGender === "Prefer to self-describe" && (
                    <FormField
                      control={form.control}
                      name="gender_self_describe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter gender" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <SelectField name="veteran" label="Are you a veteran? *" options={YES_NO_PREFER} />
                  <SelectField name="immigrant_to_us" label="Are you an immigrant to the United States? *" options={YES_NO_PREFER} />
                  <SelectField name="returning_citizen" label="Are you a returning citizen (formerly incarcerated)? *" options={YES_NO_PREFER} />
                </div>
              )}

              {/* Section 4: Developer Experience */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="years_dev_experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How many years of experience as a developer do you have? *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={60}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="years_other_experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How many years of other relevant experience do you have? (In addition to experience as a developer) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={60}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projects_completed_or_in_progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How many projects have you completed and/or have in progress? *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={999}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <RadioField name="has_project_next_12_months" label="Do you have a project that can start within the next 12 months? *" options={YES_NO} />
                </div>
              )}

              {/* Section 5: Supporting Documents */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    All documents are optional but encouraged. Accepted formats: PDF, DOC, DOCX, PNG, JPG, JPEG (max 25MB each)
                  </p>
                  <FileUploadField name="firm_overview_growth_strategy" label="Firm Overview with Growth Strategy" />
                  <FileUploadField name="one_pager_projects" label="One-Pager on Current/Previous Projects" />
                  <FileUploadField name="team_bios_resumes" label="Team Member Bios/Résumés" />
                  <FileUploadField name="upcoming_project_budget_sources_uses" label="Upcoming Project Budget (Sources and Uses)" />
                  <FileUploadField name="upcoming_project_development_timeline" label="Upcoming Project Development Timeline" />
                </div>
              )}

              {/* Section 6: Acknowledgements */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="ack_truthful"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            By submitting this application, I agree that the information included is truthful and accurate to the best of my knowledge. *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ack_not_guaranteed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            I understand that by submitting this information I am only being considered for a loan and am not guaranteed any kind of financing. I understand that I am expected to provide information as requested by Invest Detroit and the Ebiara Team in a timely manner as part of the lending review, underwriting and approval process. *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ack_authorize_credit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            I authorize Invest Detroit, the Ebiara Developer Fund I LLC and any of the funds, affiliates, or agents associated therewith to make any credit or due diligence investigations necessary to evaluate and underwrite an application for a loan. *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Compliance Notice: In accordance with federal laws and U.S. Department of the Treasury policy, this organization is prohibited from discriminating on the basis of race, color, national origin, sex, age, or disability. To file a complaint of discrimination, write to: U.S. Department of the Treasury, Director, Office of Civil Rights and Equal Employment Opportunity 1500 Pennsylvania Avenue, N.W., Washington, DC 20220; call (202) 622-1160; or send an e-mail to: crcomplaints@treasury.gov
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < SECTIONS.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default FundingForm;
