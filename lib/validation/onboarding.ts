// lib/validation/onboarding.ts
import { z } from "zod";

export const DEGREES = ["B.Tech", "M.Tech", "MBA", "PhD", "Other"] as const;
export const BRANCHES = ["CSE", "ECE", "EE", "ME", "CE", "BT", "CH", "MME", "Other"] as const;
export const EMPLOYMENT_TYPES = [
  "Student",
  "Employed",
  "Self-Employed",
  "Unemployed",
  "Other",
] as const;
export const INTERESTS = [
  "Networking, Business & Services",
  "Mentorship",
  "Research & Academia",
  "Events & Reunions",
  "Jobs & Internships",
  "Other",
] as const;

const CURRENT_YEAR = new Date().getFullYear();

export const OnboardingSchema = z.object({
  // identity + contact
  full_name: z.string().min(2, "Enter your name").max(100),
  phone_e164: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  avatar_url: z.string().url().nullable().optional(),

  // academics (DB also enforces 1965..current+4)
  graduation_year: z.coerce
    .number()
    .min(1965, "Year must be 1965 or later")
    .max(CURRENT_YEAR + 4, `Year cannot be beyond ${CURRENT_YEAR + 4}`),
  degree: z.enum(DEGREES, { required_error: "Select degree" }),
  branch: z.enum(BRANCHES, { required_error: "Select branch" }),

  // work
  employment_type: z.enum(EMPLOYMENT_TYPES, { required_error: "Select employment type" }),
  company: z.string().optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),

  // interests
  interests: z.array(z.enum(INTERESTS)).default([]),

  // directory & consent
  is_public: z.boolean().default(true),
  can_contact: z.boolean().default(true),
  has_consented_terms: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to the Terms" }),
  has_consented_privacy: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to the Privacy Policy" }),
});

export type OnboardingValues = z.infer<typeof OnboardingSchema>;
