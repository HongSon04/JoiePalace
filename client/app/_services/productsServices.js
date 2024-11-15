import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const getProductById = async (id) => {
  const response = await axios.get(API_CONFIG.PRODUCTS.GET_BY_ID(id), {
    params: { id },
  });

  if (response.status !== 200) {
    throw new Error("Có lỗi khi lấy dữ liệu sản phẩm");
  }

  console.log(response);

  return response.data.data;
};

export const fetchCategories = async (params) => {
  try {
    const response = await axios.get(API_CONFIG.CATEGORIES.GET_ALL(params));

    // Kiểm tra trạng thái HTTP
    if (response.status === 200) {
      // Trả về dữ liệu nếu thành công
      return response.data;
    } else {
      // Ném lỗi nếu trạng thái không phải 200
      throw new Error("Có lỗi khi lấy dữ liệu!");
    }
  } catch (error) {
    // Log lỗi và trả lại lỗi để xử lý ngoài hàm
    console.error("Lỗi khi gọi API:", error);
    throw new Error(error.message || "Có lỗi khi lấy dữ liệu từ API");
  }
};
export const fetchCategoriesById = async (id) => {
  try {
    const response = await axios.get(API_CONFIG.CATEGORIES.GET_BY_ID(id));

    // Kiểm tra trạng thái HTTP
    if (response.status === 200) {
      // Trả về dữ liệu nếu thành công
      return response.data;
    } else {
      // Ném lỗi nếu trạng thái không phải 200
      throw new Error("Có lỗi khi lấy dữ liệu!");
    }
  } catch (error) {
    // Log lỗi và trả lại lỗi để xử lý ngoài hàm
    console.error("Lỗi khi gọi API:", error);
    throw new Error(error.message || "Có lỗi khi lấy dữ liệu từ API");
  }
};
