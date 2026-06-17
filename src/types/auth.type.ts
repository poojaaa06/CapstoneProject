export interface LoginFormValues {
  user_unique_id: string;
  user_password: string;
  remember: boolean;
}


export interface LoginApiResponse {
  sessionId: string;
}

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
  user_image: string;
  user_pincode: string;
  user_landmark: string;
  user_city: string;
  user_state: string;
  user_country: string;
  user_address: string;

  roles: Array<string>;

  services: Array<string>
  };

export interface SummaryApiResponse {
  userSummary: UserSummary;
}

export interface ForgotPasswordFormValues {
  user_unique_id: string;
}

export interface ForgotPasswordApiResponse {
  success: boolean;
  message: string;
}