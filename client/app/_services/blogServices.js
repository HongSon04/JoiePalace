import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const fecthAllBlog = async () => {
    const response = await axios.get(API_CONFIG.BLOGS.GET_ALL);

    if (response.status !== 200) {
        throw new Error("Có lỗi khi lấy tất cả blogs");
    }

    return response.data.data;
};

export const fetchBlogDataBySlug = async (slug) => {
    try {
        const response = await axios.get(API_CONFIG.BLOGS.GET_BY_SLUG(slug));

        // Check if the response data contains a 'data' property that is an array
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data[0]; // Return the first blog item
        } else {
            throw new Error("Không có dữ liệu cho blog này"); // No data found
        }
    } catch (error) {
        // Log the error with more context
        console.error("Lỗi khi lấy dữ liệu blog:", error.message || error);

        // Optionally, you could throw a more specific error
        throw new Error("Không thể lấy dữ liệu blog. Vui lòng thử lại sau.");
    }
};
