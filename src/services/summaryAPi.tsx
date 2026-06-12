import axiosInstance from "src/api/axiosInstance";
import Endpoints from "src/api/endpoints";
import { devEnv } from "src/utils/constants";

type sessionId = string;

export const getSummaryAPI = async (sessionId: sessionId) => {
  try {
    const isDevEnv = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;
    
    let response;
    if (isDevEnv) {
      // Development: Use GET for stub file (no auth needed)
      response = await axiosInstance.get(Endpoints.GET_SUMMARY);
    } else {
      // Production: Use GET with auth header
      response = await axiosInstance.get(Endpoints.GET_SUMMARY, {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });
    }
    
    return response; // Return full response
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw error; // Always throw error so it can be caught by the caller
  }
};