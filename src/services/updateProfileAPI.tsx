import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

export const updateProfileAPI = async (data: {}) => {
  try {
    const response = await apiClient("put", Endpoints.UPDATE_PROFILE, data, {
      headers: {
        Authorization: `Bearer ${"------needs update---"}`,
      },
    });
    return response.data;
  } catch (error) {
    // throw new Error("Error fetching summary:", error);
  }
};