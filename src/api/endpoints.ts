import { devEnv } from "src/utils/constants";

export interface Endpoints {
    VALIDATE_USERNAME: string;
    VALIDATE_EMAIL: string;
    VALIDATE_PHONE: string;
    LOGIN: string;
    SIGN_UP: string;
    GET_SUMMARY: string;
    UPDATE_PROFILE: string;
}

let Endpoints: Endpoints;

// TEMPORARILY FORCE STUBS TO TEST
const isDevEnv = true; // Force this to true for now

if (isDevEnv) {
    Endpoints = {
        // Use YOUR actual filenames (camelCase, not hyphenated)
        VALIDATE_USERNAME: "/stubs/validateUsername.json",   // ✅ Fixed
        VALIDATE_EMAIL: "/stubs/validateEmail.json",         // ✅ Fixed
        VALIDATE_PHONE: "/stubs/validatePhone.json",         // ✅ Fixed
        GET_SUMMARY: "/stubs/summary.json",
        LOGIN: "/stubs/login.json",
        SIGN_UP: "/stubs/register.json",
        UPDATE_PROFILE: "/stubs/udateProfile.json",          // ⚠️ Note: you have "udateProfile.json" (typo)
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
    };
}

export default Endpoints;