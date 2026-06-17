import { devEnv } from "src/utils/constants";
 
export interface Endpoints {
    VALIDATE_USERNAME: string;
    VALIDATE_EMAIL: string;
    VALIDATE_PHONE: string;
    LOGIN: string;
    SIGN_UP: string;
    GET_SUMMARY: string;
    UPDATE_PROFILE: string;
    FORGOT_PASSWORD: string; 
}
 
let Endpoints: Endpoints;
 
// TEMPORARILY FORCE STUBS TO TEST
const isDevEnv =
  process.env.REACT_APP_ENVIRONMENT === devEnv.DEV; 
 
if (isDevEnv) {
    Endpoints = {
        // Use YOUR actual filenames (camelCase, not hyphenated)
        VALIDATE_USERNAME: "/stubs/validateUsername.json",   
        VALIDATE_EMAIL: "/stubs/validateEmail.json",         
        VALIDATE_PHONE: "/stubs/validatePhone.json",         
        GET_SUMMARY: "/stubs/summary.json",
        LOGIN: "/stubs/login.json",
        SIGN_UP: "/stubs/register.json",
        UPDATE_PROFILE: "/stubs/updateProfile.json",
        FORGOT_PASSWORD: "/stubs/forgotPassword.json",   
    };
} else {
    Endpoints = {
        VALIDATE_USERNAME: "/api/validate-username",
        VALIDATE_EMAIL: "/api/validate-email",
        VALIDATE_PHONE: "/api/validate-phone",
        GET_SUMMARY: "/api/summary",
        LOGIN: "/api/login",
        SIGN_UP: "/api/register",
        UPDATE_PROFILE: "/api/update-profile",
        FORGOT_PASSWORD: "/api/auth/forgot-password"
    };
}
 
export default Endpoints; 