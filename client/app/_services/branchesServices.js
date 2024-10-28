// services/branchService.js
import axios from "axios";
import { API_CONFIG } from "@/app/_utils/api.config";

export const fetchBranchesFromApi = async () => {
  const response = await axios.get(API_CONFIG.BRANCHES.GET_ALL);

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy danh sách chi nhánh");
  }

  return response.data.data;
};

export const fetchBranchBySlug = async (slug) => {
  const response = await axios.get(API_CONFIG.BRANCHES.GET_BY_SLUG(slug), {
    params: { slug },
  });

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu chi nhánh");
  }

  return response.data.data;
};

export const fetchCurrentBranch = async (slug) => {
  const response = await axios.get(API_CONFIG.BRANCHES.GET_BY_SLUG(slug), {
    params: { slug },
  });

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu chi nhánh");
  }

  localStorage.setItem("currentBranch", JSON.stringify(response.data.data));

  return response.data.data;
};

export const postBranchAPI = async (branch) => {
  const response = await axios.post(API_CONFIG.BRANCHES.CREATE, branch);
  if (response.status!== 201) {
    throw new Error("Có lỗi khi tạo chi nhánh mới");
  }
  return response.data.data;
}