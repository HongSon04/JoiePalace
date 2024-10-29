import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const fecthAllBlog = async () => {
    const response = await axios.get(API_CONFIG.BLOGS.GET_ALL);

    if (response.status !== 200) {
        throw new Error("Có lỗi khi lấy tất cả blogs");
    }

    return response.data.data;
};

export const fetchBlogDataById = async (blogId) => {
    try {
        const response = await axios.get(API_CONFIG.BLOGS.GET_BY_ID(blogId));

        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0];
        } else {
            throw new Error("Không có dữ liệu cho blog này");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        throw error;
    }
};
