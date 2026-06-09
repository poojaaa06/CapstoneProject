import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

export const validateUsername = async (username: string) => {
    console.log("Checking username:", username);
    try {
      // Construct the query parameter string
      const queryParams = new URLSearchParams({ user_unique_id: username }).toString();
      
      // Make the GET request with query parameters
      const response = await apiClient("get", `${Endpoints.VALIDATE_USERNAME}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error validating username details:', error);
      throw new Error('Error validating username details');
    }
  };