import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

export const validateEmail = async (email: string) => {
    console.log("Checking email:", email);
    try {
        // For development - use stub data
        const response = await fetch(`/stubs/validate-email.json?user_email=${email}`);
        const data = await response.json();
        return data;
        
        // For production - uncomment when backend is ready
        // const queryParams = new URLSearchParams({ user_email: email }).toString();
        // const response = await apiClient("get", `${Endpoints.VALIDATE_EMAIL}?${queryParams}`);
        // return response.data;
    } catch (error) {
        console.error('Error validating email details:', error);
        // Return a default response instead of throwing error
        return { success: true, emailValidation: { exists: false } };
    }
};