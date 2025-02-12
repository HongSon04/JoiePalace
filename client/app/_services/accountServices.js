import axios from "axios";
import { API_CONFIG, makeAuthorizedRequest } from "../_utils/api.config";
import Cookies from "js-cookie";

export const fetchUserProfile = async () => {
  const response = await axios.get(API_CONFIG.USER.PROFILE);

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy thông tin tài khoản");
  }

  return response.data.data;
};

export const createAccountUser = async (dataToSend) => {
  const response = await axios.post(API_CONFIG.AUTH.REGISTER, dataToSend);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Có lỗi khi tạo tài khoản");
  }

  return response.data.data;
};
export const loginAccountUser = async (dataToSend) => {
  const response = await axios.post(API_CONFIG.AUTH.LOGIN, dataToSend);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Có lỗi khi đăng nhập");
  }

  return response;
};
export const loginGoogle = async (dataToSend) => {
  const response = await axios.post(
    API_CONFIG.AUTH.LOGIN_GOOLGE,
    dataToSend
  );
  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Có lỗi");
  }
  return response;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(API_CONFIG.MAIL.FORGOT_PASSWORD, email);

  return response;
};

export const resetPassword = async (data) => {
  const response = await axios.post(API_CONFIG.USER.FORGOT_PASSWORD, data);

  console.log("response -> resetPassword", response);

  return response;
};
