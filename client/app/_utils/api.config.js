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
const NOTIFICATIONS_API = `${HOST}/notifications`;

// API Endpoints
export const API_CONFIG = {
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
    GET_ALL: `${USER_API}/get-all`,
    GET_ALL_DELETED: `${USER_API}/get-all-deleted`,
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
    GET_ALL: `${BRANCHES_API}/get-all`,
    GET_ALL_DELETED: `${BRANCHES_API}/get-all-deleted`,
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
    GET_ALL: `${CATEGORIES_API}/get-all`,
    GET_ALL_DELETED: `${CATEGORIES_API}/get-all-deleted`,
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
    GET_ALL_INFO_EACH_TIME: `${DASHBOARD_API}/get-all-info-by-each-time`,
    GET_TOTAL_REVENUE_FOR_ALL_BRANCH_EACH_MONTH: `${DASHBOARD_API}/total-revenue-for-all-branch-each-month`,
    GET_TOTAL_REVENUE_BRANCH_WEEK: `${DASHBOARD_API}/total-revenue-for-each-branch-by-week`,
    GET_TOTAL_REVENUE_BRANCH_MONTH: `${DASHBOARD_API}/total-revenue-for-each-branch-by-month`,
    GET_TOTAL_REVENUE_BRANCH_QUARTER: `${DASHBOARD_API}/total-revenue-for-each-branch-by-quarter`,
    GET_TOTAL_REVENUE_BRANCH_YEAR: `${DASHBOARD_API}/total-revenue-for-each-branch-by-year`,
    GET_ALL_BRANCH: `${HOST}/branches/get-all`,
    GET_BOOKING_STATUS: (id) => `${DASHBOARD_API}/count-booking-status-for-each-branch/${id}`,
    GET_BOOKING_BRANCH: (id) => `${DASHBOARD_API}/get-all-info-by-each-time/${id}`,
    GET_TOTAL_REVENUE_EACH_MONTH: (id) => `${DASHBOARD_API}/total-revenue-for-each-branch-each-month/${id}`, 
    

  },

  // PRODUCTS API
  PRODUCTS: {
    CREATE: `${PRODUCTS_API}/create`,
    GET_ALL: `${PRODUCTS_API}/get-all`,
    GET_ALL_DELETED: `${PRODUCTS_API}/get-all-deleted`,
    GET_BY_ID: (id) => `${PRODUCTS_API}/get/${id}`,
    GET_BY_SLUG: (slug) => `${PRODUCTS_API}/get-by-slug/${slug}`,
    GET_BY_CATEGORY: (categoryId) =>
      `${PRODUCTS_API}/get-by-category/${categoryId}`,
    UPDATE: (id) => `${PRODUCTS_API}/update/${id}`,
    DELETE: (id) => `${PRODUCTS_API}/delete/${id}`,
    RESTORE: (id) => `${PRODUCTS_API}/restore/${id}`,
    DESTROY: (id) => `${PRODUCTS_API}/destroy/${id}`,
  },

  // FEEDBACKS API
  FEEDBACKS: {
    CREATE: `${FEEDBACKS_API}/create`,
    GET_ALL_SHOW: `${FEEDBACKS_API}/get-all-show`,
    GET_ALL_HIDE: `${FEEDBACKS_API}/get-all-hide`,
    GET_BY_ID: (id) => `${FEEDBACKS_API}/get/${id}`,
    GET_BY_BOOKING: (bookingId) =>
      `${FEEDBACKS_API}/get-by-booking/${bookingId}`,
    GET_BY_USER: (userId) => `${FEEDBACKS_API}/get-by-user/${userId}`,
    UPDATE: (id) => `${FEEDBACKS_API}/update/${id}`,
    DESTROY: (id) => `${FEEDBACKS_API}/destroy/${id}`,
  },

  // NOTIFICATIONS API
  NOTIFICATIONS: {},
};
