import axiosInstance from "src/api/axiosInstance";
import Endpoints from "src/api/endpoints";
import { devEnv } from "src/utils/constants";

export const forgotPasswordAPI = async (formData: {
  user_unique_id: string;
}) => {
  try {
    const isDevEnv = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;
    
    if (isDevEnv) {
      // Development: Get users from forgot-password.json stub
      const response = await axiosInstance.get(Endpoints.FORGOT_PASSWORD);
      console.log("Full response:", response);
      
      // Check different possible response structures
      let users = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (Array.isArray(response?.data)) {
        users = response.data;
      } else if (response?.data?.users) {
        users = response.data.users;
      }
      
      console.log("Users array:", users);
      console.log("Looking for username:", formData.user_unique_id.trim());
      
      // Find user by userID (case-insensitive)
      const user = users.find(
        (u: any) => u.userID?.toLowerCase() === formData.user_unique_id.trim().toLowerCase()
      );
      
      console.log("Found user:", user);

      if (user) {
        // Return success with email
        return {
          success: true,
          message: `Password reset link has been sent to ${user.Email}.`,
          email: user.Email,
        };
      } else {
        // Return generic message for security (but still success)
        return {
          success: true,
          message: "If an account exists with this username, a reset link will be sent.",
        };
      }
    } else {
      // Production: Use real API
      const response = await axiosInstance.post(Endpoints.FORGOT_PASSWORD, formData);
      return response.data;
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    // Return a user-friendly error
    return {
      success: false,
      message: "Unable to process your request. Please try again later.",
    };
  }
};