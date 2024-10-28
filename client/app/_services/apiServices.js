import axios from "axios";
import { API_CONFIG } from "@/app/_utils/api.config";
// Lấy accessToken từ cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};
export const fetchAllDashBoard = async () => {
    try {
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_ALL_INFO);
      if (response.status !== 200) {
        throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
    } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
    }
  };
export const fetchAllTotalRevenueMonth = async () => {
    try {
        const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_FOR_ALL_BRANCH_EACH_MONTH );
        if (response.status !== 200) {
        throw new Error("Có lỗi khi lấy dữ liệu !");
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi:", error);
        throw error; 
    }
};
export const fetchAllEachTime = async () => {
    try {
        const response = await axios.get(API_CONFIG.DASHBOARD.GET_ALL_INFO_EACH_TIME );
        if (response.status !== 200) {
        throw new Error("Có lỗi khi lấy dữ liệu !");
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi:", error);
        throw error; 
    }
};


export const fetchRevenueBranchByWeek = async () => {
  try {
    const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_BRANCH_WEEK);
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
    }
    return response.data; 
  } catch (error) {
    console.error("Lỗi:", error);
    throw error; 
  }
};


export const fetchRevenueBranchByMonth = async () => {
  try {
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_BRANCH_MONTH );
      if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
  } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
  }
};

export const fetchRevenueBranchByQuarter = async () => {
  try {
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_BRANCH_QUARTER);
      if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
  } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
  }
};

export const fetchRevenueBranchByYear = async () => {
  try {
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_BRANCH_YEAR );
      if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
  } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
  }
};

export const fetchAllBranch = async () => {
  try {
      const response = await axios.get(API_CONFIG.BRANCHES.GET_ALL );
      if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
  } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
  }
};
// export const fetchUserById = async (userId) => {
//   try {
//     const token = getCookie('accessToken');
//     const response = await axios.get(API_CONFIG.USER.GET_BY_ID(userId), {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       }
//     });
    
//     if (response.status !== 200) {
//       throw new Error("Có lỗi khi lấy dữ liệu !");
//     }
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi:", error);
//     throw error;
//   }
// };


// export const fetchBranchById = async (branchId) => {
//   try {
//     const response = await axios.get(API_CONFIG.BRANCHES.GET_BY_ID(branchId));
    
//     if (response.status !== 200) {
//       throw new Error("Có lỗi khi lấy dữ liệu !");
//       }
//       return response.data;
//   } catch (error) {
//     console.error("Lỗi:", error);
//     throw error;
//   }
// };
export const fetchAllBooking = async () => {
  try {
      const token = getCookie('accessToken');
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_ALL_BOOKING, {
          headers: {
              'Authorization': `Bearer ${token}`,
          }
      });

      if (response.status !== 200) {
          throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      
      return response.data;
  } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
  }
};
export const fetchInfoByMonth = async () => {
  try {
    const response = await axios.get(API_CONFIG.DASHBOARD.GET_INFO_BY_MONTH);
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
    }
    return response.data; 
  } catch (error) {
    console.error("Lỗi:", error);
    throw error; 
  }
};