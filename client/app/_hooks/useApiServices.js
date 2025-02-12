import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { API_CONFIG } from "../_utils/api.config";

const useApiServices = () => {
  const router = useRouter();

  // Utility function to handle API calls with error catching
  const tryCatchWrapper = async (callback, options) => {
    try {
      return await callback();
    } catch (error) {
      return {
        success: false,
        message: options?.errorMessage || "An error occurred",
        error: error.response ? error.response.data : error.message,
      };
    }
  };

  // Function to make API requests with optional method and data
  const apiRequest = async (
    endpoint,
    method = "GET",
    data = null,
    options = {}
  ) => {
    const accessToken = Cookies.get("accessToken");

    return await tryCatchWrapper(async () => {
      const response = await axios({
        url: endpoint,
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data,
        ...options,
      });
      return response.data;
    });
  };

  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async (redirectURL) => {
    const refreshToken = localStorage.getItem("refreshToken");

    // Check if the refresh token is available
    if (!refreshToken) {
      router.push(redirectURL);
      return null; // No refresh token available
    }

    const result = await tryCatchWrapper(async () => {
      const response = await axios.post(API_CONFIG.AUTH.REFRESH_TOKEN, {
        refresh_token: refreshToken,
      });

      if (response.status !== 200) {
        return { success: false, message: "Refresh token failed" };
      }

      // Update the access token in cookies
      Cookies.set("accessToken", response.data.access_token, { expires: 1 });

      // Update the refresh token if provided
      if (response.data.refresh_token) {
        localStorage.setItem("refreshToken", response.data.refresh_token);
      }

      return response.data.access_token; // Return the new access token
    });

    // Handle expired refresh token
    if (result && result.success === false) {
      router.push(redirectURL);
      Cookies.remove("accessToken");
      localStorage.removeItem("refreshToken");
    }

    return result; // Return the result (new access token or error)
  };

  // Function for making authorized API requests
  const makeAuthorizedRequest = async (
    endpoint,
    method = "GET",
    data = null,
    signal = null,
    redirectURL = "/auth/chon-chi-nhanh?isExpired=true"
  ) => {
    let dataResponse;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      dataResponse = await apiRequest(endpoint, method, data, signal);

      // Check if the response indicates an unauthorized error
      if (
        dataResponse &&
        dataResponse.success === false &&
        dataResponse.error.error === "Unauthorized"
      ) {
        const newAccessToken = await refreshAccessToken(redirectURL);

        // If a new access token was obtained, retry the request
        if (newAccessToken) {
          attempts++;
          continue; // Retry the API request
        } else {
          // If the refresh token is expired or invalid, break the loop
          break;
        }
      }

      // If the request was successful, break the loop
      break;
    }

    return {
      ...dataResponse,
      success: dataResponse?.success !== false,
    };
  };

  // Function for fetching data with Redux integration
  const fetchData = async (
    dispatch,
    apiCall,
    { loadingAction, successAction, errorAction }
  ) => {
    dispatch(loadingAction());
    const result = await tryCatchWrapper(apiCall);
    if (result.success === false) {
      dispatch(errorAction(result.message));
    } else {
      dispatch(successAction(result));
    }
    return result; // Return the result for further handling
  };

  return { fetchData, tryCatchWrapper, makeAuthorizedRequest };
};

export default useApiServices;
