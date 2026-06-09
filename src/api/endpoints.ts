import { devEnv } from "src/utils/constants";

// We define the Endpoints interface
export interface Endpoints {
    VALIDATE_USERNAME: "/validate-username" | "/validate-username.json";
    VALIDATE_EMAIL: "/validate-email" | "/validate-email.json";
    VALIDATE_PHONE: "/validate-phone" | "/validate-phone.json";
    LOGIN:"/login" | "/login.json";
    SIGN_UP:"/register" | '/register.json';
    GET_SUMMARY: "/summary" | "/summary.json";
    UPDATE_PROFILE: "/update-profile" | "/updateProfile.json";
}

// We declare and initialize the Endpoints object based on the environment
let Endpoints: Endpoints;
const isDevEnv: boolean = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;

if (isDevEnv) {
    // If in development environment, use BE endpoint
    Endpoints = {
        VALIDATE_USERNAME: "/validate-username.json",
        VALIDATE_EMAIL: "/validate-email.json",
        VALIDATE_PHONE: "/validate-phone.json",
        GET_SUMMARY: "/summary.json",
        LOGIN: "/login.json",
        SIGN_UP:'/register.json',
        UPDATE_PROFILE:'/updateProfile.json',
    };
} else {
    // Otherwise, use stubs endpoint
    Endpoints = {
        VALIDATE_USERNAME: "/validate-username",
        VALIDATE_EMAIL: "/validate-email",
        VALIDATE_PHONE: "/validate-phone",
        GET_SUMMARY: "/summary",
        LOGIN:"/login",
        SIGN_UP:"/register",
        UPDATE_PROFILE:'/update-profile',
    };
}

// We export the Endpoints object
export default Endpoints;
