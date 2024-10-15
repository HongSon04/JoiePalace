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
  // LATER: Remove authorization header - don't need to authorize to get branch
  const response = await axios.get(API_CONFIG.BRANCHES.GET_BY_SLUG(slug), {
    params: { slug },
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbjEiLCJlbWFpbCI6ImFkbWluMUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJwaG9uZSI6IjEyMzEyMzEzMjEiLCJpYXQiOjE3Mjg5MDY2MDQsImV4cCI6MTcyODkxMDIwNH0.SvD0-1QXZZX0RyOTN_mm-RTCtiDNU5N0wrHKPr92S2E`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu chi nhánh");
  }

  return response.data.data;
};
