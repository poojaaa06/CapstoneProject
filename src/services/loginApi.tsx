import axiosInstance from "src/api/axiosInstance";
import Endpoints from "src/api/endpoints";
import { devEnv } from "src/utils/constants";

export const loginAPI = async (formData: {
  user_unique_id: string;
  user_password: string;
}) => {
  console.log("🔵 loginAPI called");
  try {
    const isDevEnv = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;
    
    let response;
    if (isDevEnv) {
      // Development: Use GET for stub file
      response = await axiosInstance.get(Endpoints.LOGIN);
    } else {
      // Production: Use POST for real API
      response = await axiosInstance.post(Endpoints.LOGIN, formData);
    }
    
    console.log("🟢 Login response:", response);
    return response; // Return full response
  } catch (error) {
    console.error("🔴 Login error:", error);
    throw error;
  }
};

// Also export getSummaryAPI if needed, or keep it in a separate file