// services/branchService.js
import axios from "axios";
import { API_CONFIG } from "@/app/_utils/api.config";

export const fetchBranchesFromApi = async () => {
  const response = await axios.get(
    API_CONFIG.BRANCHES.GET_ALL({
      itemsPerPage: 99999,
    })
  );

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

  // console.log(response.data.data);

  localStorage.setItem(
    "currentBranch",
    JSON.stringify(response.data.data.at(0))
  );

  return response.data.data.at(0);
};

export const postBranchAPI = async (branch) => {
  try {
    const response = await axios.post(API_CONFIG.BRANCHES.CREATE, branch);
    if (response.status!== 201) {
      throw new Error("Có lỗi khi tạo chi nhánh mới");
    }
    return response.data.data;
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
<<<<<<< HEAD
  return response.data.data;
};
=======
}
>>>>>>> e5ee1dd874c270e8defa67e7be85694d891303e9

export const fetchBranchDataById = async (branchId) => {
  try {
    const response = await axios.get(
      API_CONFIG.DASHBOARD.GET_BOOKING_STATUS(branchId)
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error("Không có dữ liệu cho chi nhánh này");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};

export const fetchBranchBookingById = async (branchId) => {
  try {
    const response = await axios.get(
      API_CONFIG.DASHBOARD.GET_BOOKING_BRANCH(branchId)
    );
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu chi nhánh");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};

export const fetchBranchTotalRevenueMonth = async (branchId) => {
  try {
    const response = await axios.get(
      API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_EACH_MONTH(branchId)
    );
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu chi nhánh");
    }
  } catch (error) {
    throw error;
  }
};
