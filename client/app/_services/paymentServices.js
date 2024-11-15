import axios from "axios";
import { API_CONFIG } from "../_utils/api.config";

export const payment_method = async (method, deposit_id) => {
    try {
        const response = await axios.post(API_CONFIG.PAYMENT.PAYMENT_METHOD(method, deposit_id));
        const data = response.data;

        if (data.status !== 200) {
            throw new Error(data.error?.message || "Payment method request failed.");
        }

        return data;
    } catch (error) {
        console.error("Error during payment method request:", error);
        throw error;
    }
};
