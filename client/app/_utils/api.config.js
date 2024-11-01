// HOST URL
const HOST = `https://joieplace.live/api`;
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
  PARTYTYPES: {
    CREATE: `${PARTYTYPES_API}/create`,
    GET_ALL: (params) =>
      constructUrlWithParams(`${PARTYTYPES_API}/get-all`, params),
  },

  // BOOKINGS API
  BOOKINGS: {
    CREATE: `${BOOKING_API}/create`,
    GET_ALL: (params) =>
      constructUrlWithParams(`${BOOKING_API}/get-all`, params),
    UPDATE_STATUS: (id) => `${BOOKING_API}/update-status/${id}`,
    GET_BY_ID: (id) => `${BOOKING_API}/get/${id}`,
    UPDATE: (id) => `${BOOKING_API}/update/${id}`,
  },

  // BLOGS API
  BLOGS: {
    GET_ALL: (params) => constructUrlWithParams(`${BLOGS_API}/get-all`, params),
    GET_BY_ID: (id) => `${BLOGS_API}/get/${id}`,
  },

  // NOTIFICATIONS API
  NOTIFICATIONS: {
    // Add endpoints here if needed
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
