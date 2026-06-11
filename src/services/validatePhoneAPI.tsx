import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

export interface PhoneValidationResponse {
  success: boolean;
  phoneValidation?: { exists: boolean };
}

export const validatePhone = async (phone: string): Promise<PhoneValidationResponse> => {
  try {
    // For development - use stub data
    const response = await fetch(`/stubs/validate-phone.json?user_phone=${phone}`);
    const data = await response.json();
    return data;
    
    // For production - uncomment when backend is ready
    // const queryParams = new URLSearchParams({ user_phone: phone }).toString();
    // const response = await apiClient<PhoneValidationResponse>("get", `${Endpoints.VALIDATE_PHONE}?${queryParams}`);
    // return response.data;
  } catch (error) {
    console.error("Error validating phone details:", error);
    // Return a default response instead of throwing error
    return { success: true, phoneValidation: { exists: false } };
  }
};