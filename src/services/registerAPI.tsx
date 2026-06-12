import axiosInstance from "src/api/axiosInstance";
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
        // Check if we're in development (using stubs)
        const isDevEnv = true; // Or use your actual env check
        
        let response;
        if (isDevEnv) {
            // Use GET for stub files (POST doesn't work with static JSON)
            response = await axiosInstance.get(Endpoints.SIGN_UP);
        } else {
            // Production - use POST
            response = await axiosInstance.post(Endpoints.SIGN_UP, formData);
        }
        
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};