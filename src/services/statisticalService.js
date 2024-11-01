import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/revenue`;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};
// API lấy thông tin doanh thu cá nhân của nhân viên
export const getRevenue = async (startDate, endDate) => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_URL}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching personal revenue:", error);
    throw error;
  }
};
