import { message } from "antd";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    message.error(error?.response?.data?.message);
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);

    return response.data;
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    return { success: false, message: "Đăng ký thất bại" };
  }
};

export const getUserInfo = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lấy thông tin người dùng thất bại:", error);
    return { success: false, message: "Lấy thông tin thất bại" };
  }
};
