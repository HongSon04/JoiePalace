// HOST URL
const HOST = `https://joieplace.live/api`;
const MEMBERSHIPS = `https://joieplace.live/memberships`;
// const HOST = `http://localhost:5000`;

// Base API URLs
const AUTH_API = `${HOST}/auth`;
const USER_API = `${HOST}/user`;
const BRANCHES_API = `${HOST}/branches`;
const CATEGORIES_API = `${HOST}/categories`;
const DASHBOARD_API = `${HOST}/dashboard`;
const PRODUCTS_API = `${HOST}/products`;
const FEEDBACKS_API = `${HOST}/feedbacks`;
const PARTYTYPES_API = `${HOST}/party-types`;
const BOOKING_API = `${HOST}/bookings`;
const BLOGS_API = `${HOST}/blogs`;
const NOTIFICATIONS_API = `${HOST}/notifications`;
const MENU_API = `${HOST}/menus`;
const PACKAGES = `${HOST}/packages`;

// Function to construct URL with search params
const constructUrlWithParams = (baseUrl, params) => {
  const url = new URL(baseUrl);
  const searchParams = new URLSearchParams(params);
  url.search = searchParams.toString();
  return url.toString();
};

// API Endpoints
export const API_CONFIG = {
  GENERAL_BRANCH: "ho-chi-minh",
  FOOD_CATEGORY_SLUG: "thuc-an",
  DRINK_CATEGORY_SLUG: "do-uong",

  // AUTH API
  AUTH: {
    LOGIN: `${AUTH_API}/login`,
    REGISTER: `${AUTH_API}/register`,
    LOGOUT: `${AUTH_API}/logout`,
    REFRESH_TOKEN: `${AUTH_API}/refresh-token`,
    UPLOAD_AVATAR: `${AUTH_API}/upload-avatar`,
  },

  // USER API
  USER: {
    CREATE: `${USER_API}/create`,
    PROFILE: `${USER_API}/profile`,
    GET_ALL: (params) => constructUrlWithParams(`${USER_API}/get-all`, params),
    GET_ALL_DELETED: (params) =>
      constructUrlWithParams(`${USER_API}/get-all-deleted`, params),
    GET_BY_ID: (id) => `${USER_API}/get/${id}`,
    GET_BY_BRANCH_ID: (id) => `${USER_API}/get-all-by-branch-id/${id}`,
    CHANGE_PASSWORD: `${USER_API}/change-password`,
    CHANGE_PROFILE: `${USER_API}/change-profile`,
    DELETE: (id) => `${USER_API}/delete/${id}`,
    RESTORE: (id) => `${USER_API}/restore/${id}`,
    DESTROY: (id) => `${USER_API}/destroy/${id}`,
  },

  // BRANCHES API
  BRANCHES: {
    CREATE: `${BRANCHES_API}/create`,
    GET_ALL: (params) =>
      constructUrlWithParams(`${BRANCHES_API}/get-all`, params),
    GET_ALL_DELETED: (params) =>
      constructUrlWithParams(`${BRANCHES_API}/get-all-deleted`, params),
    GET_BY_ID: (id) => `${BRANCHES_API}/get/${id}`,
    GET_BY_SLUG: (slug) => `${BRANCHES_API}/get-by-slug/${slug}`,
    UPDATE: (id) => `${BRANCHES_API}/update/${id}`,
    DELETE: (id) => `${BRANCHES_API}/delete/${id}`,
    RESTORE: (id) => `${BRANCHES_API}/restore/${id}`,
    DESTROY: (id) => `${BRANCHES_API}/destroy/${id}`,
  },

  // CATEGORIES API
  CATEGORIES: {
    CREATE: `${CATEGORIES_API}/create`,
    GET_ALL: (params) =>
      constructUrlWithParams(`${CATEGORIES_API}/get-all`, params),
    GET_ALL_DELETED: (params) =>
      constructUrlWithParams(`${CATEGORIES_API}/get-all-deleted`, params),
    GET_BY_ID: (id) => `${CATEGORIES_API}/get/${id}`,
    GET_BY_SLUG: (slug) => `${CATEGORIES_API}/get-by-slug/${slug}`,
    UPDATE: (id) => `${CATEGORIES_API}/update/${id}`,
    DELETE: (id) => `${CATEGORIES_API}/delete/${id}`,
    RESTORE: (id) => `${CATEGORIES_API}/restore/${id}`,
    DESTROY: (id) => `${CATEGORIES_API}/destroy/${id}`,
  },

  // DASHBOARD API
  DASHBOARD: {
    GET_ALL_INFO_BY_MONTH: (id) =>
      `${DASHBOARD_API}/get-dashboard-general-info-by-month/${id}`,
    GET_TOTAL_REVENUE_BRANCH_WEEK: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-by-week/${id}`,
    GET_TOTAL_REVENUE_BRANCH_MONTH: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-by-month/${id}`,
    GET_TOTAL_REVENUE_BRANCH_QUARTER: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-by-quarter/${id}`,
    GET_TOTAL_REVENUE_BRANCH_YEAR: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-by-year/${id}`,
    // GET_ALL_BRANCH: `${HOST}/branches/get-all`,
    GET_ALL_BOOKING: `${HOST}/bookings/get-all`,
    GET_INFO_BY_MONTH: (id) =>
      `${DASHBOARD_API}/get-dashboard-general-info-by-month/${id}`,
    GET_BOOKING_STATUS: (id) =>
      `${DASHBOARD_API}/count-booking-status-for-each-branch/${id}`,
    GET_BOOKING_BRANCH: (id) =>
      `${DASHBOARD_API}/get-all-info-by-each-time/${id}`,
    GET_TOTAL_REVENUE_EACH_MONTH: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-each-month/${id}`,
    GET_BOOKING_STATUS: (id) =>
      `${DASHBOARD_API}/count-booking-status-for-each-branch/${id}`,
    GET_TOTAL_REVENUE_EACH_MONTH: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-each-month/${id}`,

    GET_ALL_INFO_BRANCH: (id) =>
      `${DASHBOARD_API}/get-all-info-by-each-time/${id}`,
    GET_TOTAL_REVENUE_EACH_MONTH: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-each-month/${id}`,
    GET_BOOKING_STATUS: (id) =>
      `${DASHBOARD_API}/count-booking-status-for-each-branch/${id}`,

    GET_INFO_BY_MONTH: (id) =>
      `${DASHBOARD_API}/get-dashboard-general-info-by-month/${id}`,
    GET_BOOKING_STATUS: (id) =>
      `${DASHBOARD_API}/count-booking-status-for-each-branch/${id}`,
    GET_ALL_INFO_BRANCH: (id) =>
      `${DASHBOARD_API}/get-all-info-by-each-time/${id}`,
    GET_TOTAL_REVENUE_EACH_MONTH: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-each-month/${id}`,
    GET_BOOKING_STATUS: (id) =>
      `${DASHBOARD_API}/count-booking-status-for-each-branch/${id}`,

    GET_ALL_INFO: `${DASHBOARD_API}/get-all-info`,
    GET_ALL_INFO_EACH_TIME: (id) =>
      `${DASHBOARD_API}/get-all-info-by-each-time/${id}`,
    GET_TOTAL_REVENUE_FOR_ALL_BRANCH_EACH_MONTH: `${DASHBOARD_API}/total-revenue-for-all-branch-each-month`,
    GET_TOTAL_REVENUE_BRANCH_WEEK: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-by-week/${id}`,
    GET_TOTAL_REVENUE_BRANCH_MONTH: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-by-month/${id}`,
    GET_TOTAL_REVENUE_BRANCH_QUARTER: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-by-quarter/${id}`,
    GET_TOTAL_REVENUE_BRANCH_YEAR: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-by-year/${id}`,
    GET_ALL_BRANCH: `${HOST}/branches/get-all`,
    GET_ALL_BOOKING: `${HOST}/bookings/get-all`,
    GET_INFO_BY_MONTH: (id) =>
      `${DASHBOARD_API}/get-dashboard-general-info-by-month/${id}`,
    GET_BOOKING_STATUS: (id) =>
      `${DASHBOARD_API}/count-booking-status-for-each-branch/${id}`,
    GET_BOOKING_BRANCH: (id) =>
      `${DASHBOARD_API}/get-all-info-by-each-time/${id}`,
    GET_TOTAL_REVENUE_EACH_MONTH: (id) =>
      `${DASHBOARD_API}/total-revenue-for-each-branch-each-month/${id}`,
  },

  // PRODUCTS API
  PRODUCTS: {
    CREATE: `${PRODUCTS_API}/create`,
    GET_ALL: (params) =>
      constructUrlWithParams(`${PRODUCTS_API}/get-all`, params),
    GET_ALL_DELETED: (params) =>
      constructUrlWithParams(`${PRODUCTS_API}/get-all-deleted`, params),
    GET_BY_ID: (id) => `${PRODUCTS_API}/get/${id}`,
    GET_BY_SLUG: (slug) => `${PRODUCTS_API}/get-by-slug/${slug}`,
    GET_BY_CATEGORY: (categoryId, params) =>
      constructUrlWithParams(
        `${PRODUCTS_API}/get-by-category/${categoryId}`,
        params
      ),
    UPDATE: (id) => `${PRODUCTS_API}/update/${id}`,
    DELETE: (id) => `${PRODUCTS_API}/delete/${id}`,
    RESTORE: (id) => `${PRODUCTS_API}/restore/${id}`,
    DESTROY: (id) => `${PRODUCTS_API}/destroy/${id}`,
  },

  // FEEDBACKS API
  FEEDBACKS: {
    CREATE: `${FEEDBACKS_API}/create`,
    GET_ALL: (params) =>
      constructUrlWithParams(`${FEEDBACKS_API}/get-all`, params),
    GET_ALL_USER: (`${FEEDBACKS_API}/get-all`),
    GET_ALL_SHOW: (params) =>
      constructUrlWithParams(`${FEEDBACKS_API}/get-all-show`, params),
    GET_ALL_HIDE: (params) =>
      constructUrlWithParams(`${FEEDBACKS_API}/get-all-hide`, params),
    GET_BY_ID: (id) => `${FEEDBACKS_API}/get/${id}`,
    GET_BY_BOOKING: (bookingId, params) =>
      constructUrlWithParams(
        `${FEEDBACKS_API}/get-by-booking/${bookingId}`,
        params
      ),
    GET_BY_BRANCH: (branchId, params) =>
      constructUrlWithParams(
        `${FEEDBACKS_API}/get-by-branch/${branchId}`,
        params
      ),
    GET_BY_USER: (userId, params) =>
      constructUrlWithParams(`${FEEDBACKS_API}/get-by-user/${userId}`, params),
    UPDATE: (id) => `${FEEDBACKS_API}/update/${id}`,
    DESTROY: (id) => `${FEEDBACKS_API}/destroy/${id}`,
  },

  // PARTY TYPES API
  PARTY_TYPES: {
    CREATE: `${PARTYTYPES_API}/create`,
    GET_ALL: (params) =>
      constructUrlWithParams(`${PARTYTYPES_API}/get-all`, params),
    GET_BY_ID: (id) => `${PARTYTYPES_API}/get/${id}`,
  },

  // BOOKINGS API
  BOOKINGS: {
    CREATE: `${BOOKING_API}/create`,
    GET_ALL: (params) =>
      constructUrlWithParams(`${BOOKING_API}/get-all`, params),
    UPDATE_STATUS: (id) => `${BOOKING_API}/update-status/${id}`,
    GET_BY_ID: (id) => `${BOOKING_API}/get/${id}`,
    UPDATE: (id) => `${BOOKING_API}/update/${id}`,
    UPDATE_STATUS: (id) => `${BOOKING_API}/update-status/${id}`,
    GET_ALL_BY_IDUSER: (userId) => `${BOOKING_API}/get-all?user_id=${userId}`,
  },

  // BLOGS API
  BLOGS: {
    // CREATE: `${BLOGS_API}/create`,
    GET_ALL: `${BLOGS_API}/get-all`,
    GET_BY_SLUG: (slug) => `${BLOGS_API}/get-by-slug/${slug}`,
  },

  //MEMBERSHIPS
  MEMBERSHIPS: {
    CREATE: `${MEMBERSHIPS}/create`,
    GET_ALL: `${MEMBERSHIPS}/get-all`,
    GET_ALL_DELETED: `${MEMBERSHIPS}/get-all-deleted`,
    GET_BY_ID: (membershipId) => `${MEMBERSHIPS}/get/${membershipId}`,
    GET_BY_SLUG: (membershipSlug) =>
      `${MEMBERSHIPS}/get-by-slug/${membershipSlug}`,
    UPDATE: (membershipId) => `${MEMBERSHIPS}/update/${membershipId}`,
    DELETE: (membershipId) => `${MEMBERSHIPS}/delete/${membershipId}`,
    RESTORE: (membershipId) => `${MEMBERSHIPS}/restore/${membershipId}`,
    HARD_DELETE: (membershipId) => `${MEMBERSHIPS}/hard-delete/${membershipId}`,
  },

  // NOTIFICATIONS API
  NOTIFICATIONS: {
    // Add endpoints here if needed
  },

  // PACKAGES API

  PACKAGES: {
    GET_ALL: `${PACKAGES}/get-all`,
  },

  // MENU API
  MENU: {
    GET_ALL: (params) => constructUrlWithParams(`${MENU_API}/get-all`, params),
    GET_ALL_DELETED: (params) =>
      constructUrlWithParams(
        `${MENU_API}/get-all-deleted
      `,
        params
      ),
    GET_BY_SLUG: (slug) => `${MENU_API}/get-by-slug/${slug}`,
    GET_BY_ID: (id) => `${MENU_API}/get/${id}`,
    CREATE: `${MENU_API}/create`,
    UPDATE: (id) => `${MENU_API}/update/${id}`,
    DELETE: (id) => `${MENU_API}/delete/${id}`,
    RESTORE: (id) => `${MENU_API}/restore/${id}`,
    DESTROY: (id) => `${MENU_API}/destroy/${id}`,
  },
};

// apiServices.js
import axios from "axios";
import Cookies from "js-cookie";

// Utility function to handle API calls with error catching
export const tryCatchWrapper = async (callback, options) => {
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
export const apiRequest = async (
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
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const result = await tryCatchWrapper(async () => {
    const response = await axios.post(API_CONFIG.AUTH.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });

    if (response.status !== 200) {
      return { success: false, message: "Refresh token failed" };
    }

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

  return result; // Return the result (new access token or error)
};

// Function for making authorized API requests
export const makeAuthorizedRequest = async (
  endpoint,
  method = "GET",
  data = null,
  signal = null
) => {
  let dataResponse = await apiRequest(endpoint, method, data, signal);

  // Check if the response indicates an unauthorized error
  if (
    dataResponse &&
    dataResponse.success === false &&
    dataResponse.error.error === "Unauthorized"
  ) {
    const newAccessToken = await refreshAccessToken();

    // If a new access token was obtained, retry the request
    if (newAccessToken) {
      dataResponse = await apiRequest(endpoint, method, data, signal);
    }
  }

  return {
    ...dataResponse,
    success: dataResponse?.success !== false,
  }; // Return the response (either success or error)
};

// Function for fetching data with Redux integration
export const fetchData = async (
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
  return result; 
};
