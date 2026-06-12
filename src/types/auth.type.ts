export interface LoginFormValues {
  user_unique_id: string;
  user_password: string;
  remember: boolean;
}

export interface ForgotPasswordFormValues {
  user_unique_id: string;
}

export interface LoginApiResponse {
  sessionId: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

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