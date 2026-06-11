import axios from "axios";
import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

export const loginAPI = async (formData: {
  user_unique_id: string;
  user_password: string;
}) => {
  try {
    const response = await apiClient("post", Endpoints.LOGIN, formData);
    // const response = await axios.get("http://localhost:3000/stubs/login.json");
    return response;
  } catch (error) {
    //Need to add global notification for errors.  TODO
    console.log("----", error);
  }
};

