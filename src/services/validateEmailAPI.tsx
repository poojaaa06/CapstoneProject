import axiosInstance from "src/api/axiosInstance";
import Endpoints from "src/api/endpoints";

export const validateEmail = async (email: string) => {
    console.log("Checking email:", email);
    try {
        const queryParams = new URLSearchParams({ user_email: email }).toString();
        const response = await axiosInstance.get(`${Endpoints.VALIDATE_EMAIL}?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error('Error validating email details:', error);
        // Return a default response instead of throwing error
        return { success: true, emailValidation: { exists: false } };
    }
};