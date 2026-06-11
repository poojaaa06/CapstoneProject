import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

export const validateUsername = async (username: string) => {
    console.log("Checking username:", username);
    try {
        // For development - use stub data
        const response = await fetch(`/stubs/validate-username.json?user_unique_id=${username}`);
        const data = await response.json();
        return data;
        
        // For production - uncomment when backend is ready
        // const queryParams = new URLSearchParams({ user_unique_id: username }).toString();
        // const response = await apiClient("get", `${Endpoints.VALIDATE_USERNAME}?${queryParams}`);
        // return response.data;
    } catch (error) {
        console.error('Error validating username details:', error);
        // Return a default response instead of throwing error
        return { success: true, usernameValidation: { exists: false } };
    }
};