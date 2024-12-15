import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const getAllPackages = async () => {
  const response = await axios.get(
    "http://joieplace.live/api/packages/get-all"
  );
  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Có lỗi xảy ra khi lấy dữ liệu");
  }

  return { data: response.data.data };
};
export const getPackageBySlug = async (slug) => {
  const response = await axios.get(API_CONFIG.PACKAGES.GET_BY_SLUG(slug));
  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Có lỗi xảy ra khi lấy dữ liệu");
  }
  return { data: response.data.data };
};
export const getPackageById = async (id) => {
  const response = await axios.get(API_CONFIG.PACKAGES.GET_BY_ID(id));
  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Có lỗi xảy ra khi lấy dữ liệu");
  }
  return { data: response.data.data };
};
