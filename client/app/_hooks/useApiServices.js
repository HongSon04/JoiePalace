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
      // console.error(`Error caught: ${error.message}`, error);
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

    // console.log(
    //   "access token when making request from apiRequest function -> ",
    //   accessToken
    // );
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
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const result = await tryCatchWrapper(async () => {
      const response = await axios.post(API_CONFIG.AUTH.REFRESH_TOKEN, {
        refresh_token: refreshToken,
      });

      if (response.status !== 200) {
        return { success: false, message: "Refresh token failed" };
      }

      // console.log("response from refreshAccessToken function -> ", response);
      // console.log(
      //   "response data from refreshAccessToken function -> ",
      //   response.data  
      // );
      // console.log(
      //   "token from refreshAccessToken function -> ",
      //   response.data.access_token
      // );

      // console.log(
      //   "new access token from refreshAccessToken function -> ",
      //   response.data.data.access_token
      // );

      // Update the access token in cookies
      Cookies.set("accessToken", response.data.access_token, {
        expires: 1,
      });

      // Update the refresh token if provided
      if (response.data.refresh_token) {
        localStorage.setItem("refreshToken", response.data.refresh_token);
      }

      return response.data.access_token; // Return the new access token
    });

    // Handle expired refresh token
    if (result && result.success === false) {
      // console.log("I will redirect you here");
      // console.log(
      //   "result if success === false from refreshAccessToken function -> ",
      //   result
      // );

      router.push("/auth/chon-chi-nhanh?isExpired=true");
      Cookies.remove("accessToken");
      localStorage.removeItem("refreshToken");
    }

    // console.log("result from refreshAccessToken function -> ", result);
    return result; // Return the result (new access token or error)
  };

  // Function for making authorized API requests
  const makeAuthorizedRequest = async (
    endpoint,
    method = "GET",
    data = null,
    signal = null // Add signal parameter
  ) => {
    // const accessToken = Cookies.get("accessToken");
    // console.log(
    //   "access token when making request from makeAuthoriedRequest function -> ",
    //   accessToken
    // );

    let dataResponse = await apiRequest(endpoint, method, data, signal);

    // console.log(
    //   "data response from makeAuthorizedRequest function -> ",
    //   dataResponse
    // );

    // Check if the response indicates an unauthorized error
    if (
      dataResponse &&
      dataResponse.success === false &&
      dataResponse.error.error === "Unauthorized"
    ) {
      const newAccessToken = await refreshAccessToken();

      // console.log(
      //   "this is new access token form makeAuthorizedRequest function refresh token logic -> ",
      //   newAccessToken
      // );

      // If a new access token was obtained, retry the request
      if (newAccessToken) {
        // Update the token in your API request logic if necessary
        // For example, if you're using local storage:
        // localStorage.setItem('accessToken', newAccessToken);

        // Retry the request with the new access token
        dataResponse = await apiRequest(endpoint, method, data, signal);

        // console.log(
        //   "data after retrying the request with new access token -> ",
        //   dataResponse
        // );
      }
    }

    // console.log("data response from makeAuthorizedRequest function -> ", {
    //   ...dataResponse,
    //   success: dataResponse?.success !== false,
    // });

    return {
      ...dataResponse,
      success: dataResponse?.success !== false,
    }; // Return the response (either success or error)
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
