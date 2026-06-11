import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

export const validateEmail = async (email: string) => {
    console.log("Checking email:", email);
    try {
      // Construct the query parameter string
      const queryParams = new URLSearchParams({ user_email: email }).toString();
      
      // Make the GET request with query parameters
      const response = await apiClient("get", `${Endpoints.VALIDATE_EMAIL}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error validating email details:', error);
      throw new Error('Error validating email details');
    }
  };