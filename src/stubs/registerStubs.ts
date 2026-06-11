// Mock data for the Register feature.
// Keep all hard-coded option lists out of components.

export interface SelectOption {
  label: string;
  value: string;
}

export const GENDER_OPTIONS: SelectOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const COUNTRY_OPTIONS: SelectOption[] = [
  { label: "India", value: "india" },
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Other", value: "other" },
];

// ISO country dialling codes shown in the phone prefix Select.
export const PHONE_PREFIX_OPTIONS: SelectOption[] = [
  { label: "+91 (IN)", value: "91" },
  { label: "+1 (US)", value: "1" },
  { label: "+44 (UK)", value: "44" },
  { label: "+61 (AU)", value: "61" },
  { label: "+971 (AE)", value: "971" },
];
