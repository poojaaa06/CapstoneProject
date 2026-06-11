import { useInternalMessage } from "antd/es/message/useMessage";
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
  user_active: boolean;
  user_org_limit: number;
};

// type Username = {
//   user_unique_id: string;
// }

export const registerAPI= async (formData: FormFields) => {
    try {
      const response = await apiClient("post", Endpoints.SIGN_UP, formData);
      return response.data;
    } catch (error) {
    //   throw new Error('Error fetching summary:', error);
    }
  }

  // export const validateUsername= async (formData: Username) => {
  //   console.log("reg", formData);
  //   try {
  //     const response = await apiClient("get", Endpoints.VALIDATE_USERNAME, formData);
  //     return response.data;
  //   } catch (error) {
  //   //   throw new Error('Error validating username details:', error);
  //   }
  // }

  