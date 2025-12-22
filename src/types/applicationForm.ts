import { z } from "zod";

// Phone validation regex for US format
const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/;
const zipRegex = /^\d{5}$/;

// Step 1: Applicant Information
export const applicantInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  job_title: z.string().max(100).optional().or(z.literal("")),
  home_address: z.string().max(200).optional().or(z.literal("")),
  home_city: z.string().max(100).optional().or(z.literal("")),
  home_state: z.string().max(2).optional().or(z.literal("")),
  home_zip_code: z.string().regex(zipRegex, "Zip code must be 5 digits").or(z.literal("")).optional(),
  contact_email: z.string().email("Please enter a valid email address"),
  phone_number: z.string().min(10, "Phone number is required").regex(phoneRegex, "Please enter a valid phone number"),
  has_development_firm: z.enum(["yes", "no"], { required_error: "Please select an option" }),
});

// Step 2: Eligibility Questions
export const eligibilitySchema = z.object({
  is_18_or_older: z.enum(["yes", "no"], { required_error: "This field is required" }),
  is_detroit_located: z.enum(["yes", "no"], { required_error: "This field is required" }),
  is_us_citizen_or_legal: z.enum(["yes", "no"], { required_error: "This field is required" }),
  bankruptcy_last_24_months: z.enum(["yes", "no"], { required_error: "This field is required" }),
  is_restricted_business: z.enum(["yes", "no"], { required_error: "This field is required" }),
  cannabis_related: z.enum(["yes", "no"], { required_error: "This field is required" }),
  is_elected_official: z.enum(["yes", "no"], { required_error: "This field is required" }),
  bipoc_majority_owned: z.enum(["yes", "no"], { required_error: "This field is required" }),
  previous_invest_detroit_client: z.enum(["yes", "no"], { required_error: "This field is required" }),
  criminal_offense: z.enum(["yes", "no"], { required_error: "This field is required" }),
  outstanding_judgments: z.enum(["yes", "no"], { required_error: "This field is required" }),
  bankruptcy_last_7_years: z.enum(["yes", "no"], { required_error: "This field is required" }),
});

// Step 3: Impact Metrics
export const impactMetricsSchema = z.object({
  detroit_resident: z.string().min(1, "This field is required"),
  ethnicity: z.string().min(1, "This field is required"),
  ethnicity_other: z.string().optional().or(z.literal("")),
  gender: z.string().min(1, "This field is required"),
  gender_other: z.string().optional().or(z.literal("")),
  is_veteran: z.string().min(1, "This field is required"),
  is_immigrant: z.string().min(1, "This field is required"),
  is_returning_citizen: z.string().min(1, "This field is required"),
});

// Step 4: Developer Experience
export const developerExperienceSchema = z.object({
  years_developer_experience: z.number().min(0).max(60),
  years_other_experience: z.number().min(0).max(60),
  projects_completed: z.number().min(0).max(999),
  project_starting_soon: z.enum(["yes", "no"], { required_error: "Please select an option" }),
});

// Step 5: Supporting Documents
export const supportingDocumentsSchema = z.object({
  firm_overview: z.instanceof(File).optional().nullable(),
  one_pager: z.instanceof(File).optional().nullable(),
  team_bios: z.instanceof(File).optional().nullable(),
  project_budget: z.instanceof(File).optional().nullable(),
  project_timeline: z.instanceof(File).optional().nullable(),
});

// Step 6: Acknowledgements
export const acknowledgementsSchema = z.object({
  acknowledgement_truthful: z.boolean().refine((val) => val === true, "You must agree to this acknowledgement"),
  acknowledgement_not_guaranteed: z.boolean().refine((val) => val === true, "You must agree to this acknowledgement"),
  acknowledgement_authorize: z.boolean().refine((val) => val === true, "You must agree to this acknowledgement"),
});

// Combined schema
export const fullApplicationSchema = applicantInfoSchema
  .merge(eligibilitySchema)
  .merge(impactMetricsSchema)
  .merge(developerExperienceSchema)
  .merge(supportingDocumentsSchema)
  .merge(acknowledgementsSchema);

export type ApplicantInfoData = z.infer<typeof applicantInfoSchema>;
export type EligibilityData = z.infer<typeof eligibilitySchema>;
export type ImpactMetricsData = z.infer<typeof impactMetricsSchema>;
export type DeveloperExperienceData = z.infer<typeof developerExperienceSchema>;
export type SupportingDocumentsData = z.infer<typeof supportingDocumentsSchema>;
export type AcknowledgementsData = z.infer<typeof acknowledgementsSchema>;
export type FullApplicationData = z.infer<typeof fullApplicationSchema>;

// Form step configuration
export const FORM_STEPS = [
  { id: 1, title: "Applicant Information", description: "Your personal details" },
  { id: 2, title: "Eligibility Questions", description: "Qualification check" },
  { id: 3, title: "Impact Metrics", description: "Mission alignment" },
  { id: 4, title: "Developer Experience", description: "Your background" },
  { id: 5, title: "Supporting Documents", description: "Upload files" },
  { id: 6, title: "Acknowledgements", description: "Final agreements" },
] as const;

// Dropdown options
export const ETHNICITY_OPTIONS = [
  { value: "african_american", label: "African American / Black" },
  { value: "asian", label: "Asian" },
  { value: "hispanic_latino", label: "Hispanic / Latino" },
  { value: "native_american", label: "Native American / Alaska Native" },
  { value: "native_hawaiian", label: "Native Hawaiian / Pacific Islander" },
  { value: "white", label: "White / Caucasian" },
  { value: "two_or_more", label: "Two or more races" },
  { value: "other", label: "Other (please specify)" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "other", label: "Other (please specify)" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const YES_NO_PREFER_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];
