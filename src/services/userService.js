import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};

// Cấu hình header với Authorization
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getAllInactiveStaffAccounts = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `${API_URL}/user/inactive-staff?page=${page}&limit=${limit}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách tài khoản staff chưa kích hoạt:",
      error
    );
    throw error;
  }
};

// Gọi API để approve tài khoản staff và gửi mật khẩu qua email
export const approveAccount = async (userId) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/approve/${userId}`,
      {},
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi kích hoạt tài khoản staff:", error);
    throw error;
  }
};

// Gọi API để reject tài khoản staff
export const rejectAccount = async (userId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/user/reject/${userId}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi từ chối tài khoản staff:", error);
    throw error;
  }
};

export const getUserByid = async (id) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, formData) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/user/profile/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const changePassword = async (userId, passwords) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${API_URL}/user/${userId}/changepassword`, // Thêm userId vào URL
      {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
};
// Lấy danh sách tất cả người dùng có hỗ trợ phân trang và tìm kiếm
export const getAllUser = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await axios.get(
      `${API_URL}/user?page=${page}&limit=${limit}&search=${search}`,
      authHeader()
    );
    return response.data.payload;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    throw error;
  }
};

// Tạo người dùng mới
export const createUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/create`,
      userData,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo người dùng mới:", error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (userId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/${userId}`,
      updatedData,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    throw error;
  }
};

// Khóa người dùng (Đặt trạng thái active thành false)
export const lockUser = async (userId) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/lock/${userId}`,
      {},
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi khóa người dùng:", error);
    throw error;
  }
};
export const getAllStaff = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/staff`, authHeader());
    return response.data.payload;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    throw error;
  }
};
