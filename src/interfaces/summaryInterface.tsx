// Type for userSummary based on the object structure you provided
export interface UserSummary {
  user_unique_id: string;
  user_first_name: string;
  user_middle_name: string;
  user_last_name: string;
  user_email: string;
  prefix: string;
  user_phone: string;
  user_dob: string;
  user_gender: string;
  user_bio: string;
  user_img: string;
  user_created_date: string;
  user_pincode: string;
  user_landmark: string;
  user_city: string;
  user_state: string;
  user_country: string;
  user_address: string;
  user_last_login: string;
  user_agreement: boolean;
  user_verified: boolean;
  user_selected_org: string | null;
  user_org_limit: number | null;
  user_is_active: boolean;
  roles: string[];
  services: string[];
}

// Define the userDetails structure, including success and userSummary
export interface UserDetailsResponse {
  success: boolean;
  userSummary: UserSummary;
}
