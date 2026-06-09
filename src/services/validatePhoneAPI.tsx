import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

export const validatePhone = async (phone: string) => {
    console.log("Checking phone:", phone);
    try {
      // Construct the query parameter string
      const queryParams = new URLSearchParams({ user_unique_id: phone }).toString();
      
      // Make the GET request with query parameters
      const response = await apiClient("get", `${Endpoints.VALIDATE_PHONE}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error validating phone details:', error);
      throw new Error('Error validating phone details');
    }
  };