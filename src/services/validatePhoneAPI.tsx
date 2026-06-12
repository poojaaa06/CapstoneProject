import axiosInstance from "src/api/axiosInstance";
import Endpoints from "src/api/endpoints";

export interface PhoneValidationResponse {
  success: boolean;
  phoneValidation?: { exists: boolean };
}

export const validatePhone = async (phone: string): Promise<PhoneValidationResponse> => {
  try {
    const queryParams = new URLSearchParams({ user_phone: phone }).toString();
    const response = await axiosInstance.get<PhoneValidationResponse>(`${Endpoints.VALIDATE_PHONE}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error validating phone details:", error);
    // Return a default response instead of throwing error
    return { success: true, phoneValidation: { exists: false } };
  }
};