import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { devEnv } from 'src/utils/constants';

const isDevEnv: boolean = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;

// Determine the base URL based on the environment
const baseURL =
     isDevEnv
    ? `${process.env.REACT_APP_API_URL_STUBS}`       //stubs
    : `${process.env.REACT_APP_API_URL}`;            // BE pot with URL


// Define types for the API response and request data
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
}

interface ApiRequestConfig extends AxiosRequestConfig {
  method?: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: any;
}
// Function to dynamically make requests with type safety
export const apiClient  = <T = any>(
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  url: string,
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return request({
    method:isDevEnv ? "get": method,
    url,
    data,
    ...config,
  });
};

 const request = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Add any custom headers here
  },
});
