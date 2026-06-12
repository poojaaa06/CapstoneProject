import axiosInstance from "src/api/axiosInstance";
import Endpoints from "src/api/endpoints";

export const validateUsername = async (username: string) => {
    console.log("Checking username:", username);
    try {
        const queryParams = new URLSearchParams({ user_unique_id: username }).toString();
        const response = await axiosInstance.get(`${Endpoints.VALIDATE_USERNAME}?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error validating username details:', error);
        // Return a default response instead of throwing error
        return { success: true, usernameValidation: { exists: false } };
    }
};