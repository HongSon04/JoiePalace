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
export const fetchTotalAdminWeek = async (branchId) => {
  try {
    const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_ADMIN_WEEK(branchId));
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi:", error);
    throw error; 
  }
};


export const fetchRevenueBranchByWeek = async (branchId) => {
  try {
    const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_BRANCH_WEEK(branchId));
    
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
    }
    return response.data; 
  } catch (error) {
    console.error("Lỗi:", error);
    throw error; 
  }
};


export const fetchRevenueBranchByMonth = async (branchId) => {
  try {
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_BRANCH_MONTH(branchId) );
      if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
  } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
  }
};

export const fetchRevenueBranchByQuarter = async (branchId) => {
  try {
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_BRANCH_QUARTER(branchId));
      if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
  } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
  }
};

export const fetchRevenueBranchByYear = async (branchId) => {
  try {
      const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_BRANCH_YEAR(branchId));
      if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
      }
      return response.data;
  } catch (error) {
      console.error("Lỗi:", error);
      throw error; 
  }
};
export const fetchAllByBranch = async (branchId) => {
  try {
    const response = await axios.get(API_CONFIG.DASHBOARD.GET_ALL_INFO_BRANCH(branchId));
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
    }
    return response; 
  } catch (error) {
    console.error("Lỗi:", error);
    throw error; 
  }
};
export const fetchTotalEachMonth = async (branchId) => {
  try {
    const response = await axios.get(API_CONFIG.DASHBOARD.GET_TOTAL_REVENUE_EACH_MONTH(branchId));
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
    }
    return response.result; 
  } catch (error) {
    console.error("Lỗi:", error);
    throw error; 
  }
};
export const fetchAllBranch = async () => {
  try {
      const response = await axios.get(API_CONFIG.BRANCHES.GET_ALL() );
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
export const fetchInfoByMonth = async (branchId) => {
  try {
    const response = await axios.get(API_CONFIG.DASHBOARD.GET_INFO_BY_MONTH(branchId));
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
    }
    return response.data; 
  } catch (error) {
    console.error("Lỗi:", error);
    throw error; 
  }
};

export const getUserByBranchId = async (branchId) => {
  try {
    const token = getCookie('accessToken'); 
    const response = await axios.get(API_CONFIG.USER.GET_BY_BRANCH_ID(branchId), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.status !== 200) {
      throw new Error("Có lỗi khi lấy dữ liệu !");
    }
    
    return response.data; 
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ server:", error.response.data);
      console.error("Mã lỗi:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else {
      console.error("Lỗi:", error.message);
    }
    throw error; 
  }
  
};