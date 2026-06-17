import axiosInstance from "src/api/axiosInstance";
import Endpoints from "src/api/endpoints";
import { devEnv } from "src/utils/constants";

export const loginAPI = async (formData: {
  user_unique_id: string;
  user_password: string;
}) => {
  console.log(" loginAPI called");
  try {
    const isDevEnv = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;
    console.log(isDevEnv);

    let response;

    if (isDevEnv) {
      const response = await axiosInstance.get(Endpoints.LOGIN);

      const loginData = response.data;

//       console.log("loginData =", loginData);
// console.log("formData =", formData);

      if (
        !loginData.success ||
        loginData.user.user_unique_id !== formData.user_unique_id
      ) {
        throw new Error("Invalid credentials");
      }

      if (loginData.user.user_password !== formData.user_password) {
        throw new Error("Invalid credentials");
      }

      return {
        status: 200,
        data: {
          sessionId: loginData.sessionId,
        },
      };
    }
    // Production
    response = await axiosInstance.post(Endpoints.LOGIN, formData);

    return response; // Return full response
  } catch (error) {
    console.error(" Login error:", error);
    throw error;
  }
};
