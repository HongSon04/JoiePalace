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
