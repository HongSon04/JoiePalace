import axios from "axios";
import { API_CONFIG } from "@/app/_utils/api.config";

export const getAllMemberShips = async(membershipId) => {
    try {
        const response = await axios.get(API_CONFIG.MEMBERSHIPS.GET_ALL);
        if (response.status !== 200) {
            throw new Error("Có lỗi khi lấy dữ liệu !");
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi:", error);
        throw error;
    }
}
export const fecthDatabyMembershipId = async(membershipId) => {
    try {
        const response = await axios.get(API_CONFIG.MEMBERSHIPS.GET_BY_ID(membershipId));
        if (response.status !== 200) {
            throw new Error("Có lỗi khi lấy dữ liệu !");
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi:", error);
        throw error;
    }
}