import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

type sessionId = string;

export const getSummaryAPI= async (sessionId: sessionId) => {
  try {
    const response = await apiClient(
      "get",
      Endpoints.GET_SUMMARY,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // throw new Error("Error fetching summary:", error);
  }
  }