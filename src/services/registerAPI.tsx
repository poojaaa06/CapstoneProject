import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

type FormFields = {
  user_unique_id?: string;
  user_first_name?: string;
  user_middle_name?: string;
  user_last_name?: string;
  user_email?: string;
  user_password?: string;
  confirm_password?: string;
  prefix?: string;
  user_phone?: string;
  user_dob?: any;
  user_gender?: string;
  user_bio?: string;
  user_img?: string;
  user_address?: string[];
  user_agreement?: boolean;
  user_role?: string;
  user_verified?: string;
  user_active?: string | boolean;
  user_org_limit?: string | number;
};

export const registerAPI = async (formData: FormFields) => {
    try {
        // For development - you can use a mock response
        // const response = await apiClient("post", Endpoints.SIGN_UP, formData);
        // return response.data;
        
        // Mock response for testing
        return {
            status: 201,
            success: true,
            message: "Registration successful"
        };
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};