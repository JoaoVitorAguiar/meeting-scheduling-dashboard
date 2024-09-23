import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

interface AxiosErrorResponse {
  status?: number;
  code?: string;
}

export function setupAPIClient() {
  const cookieToken = Cookies.get("meeting-scheduling");
  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookieToken}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<AxiosErrorResponse>) => {
      if (error.response?.status === 401) {
        Cookies.remove("meeting-scheduling");
      }
      return Promise.reject(error);
    }
  );

  return api;
}
