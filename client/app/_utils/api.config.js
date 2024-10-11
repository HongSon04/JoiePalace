// HOST URL
// const HOST = `https://joieplace.live`;
const HOST = `http://localhost:5000`;

// Base API URLs
const AUTH_API = `${HOST}/auth`;
const USER_API = `${HOST}/user`;
const BRANCHES_API = `${HOST}/branches`;

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
};
