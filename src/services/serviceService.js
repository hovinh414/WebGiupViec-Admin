import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

// Lấy tất cả các dịch vụ với phân trang và lọc
export const getAllServices = async (
  page = 1,
  limit = 10,
  search = "",
  categoryId = ""
) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.get(
      `${API_URL}/service?page=${page}&limit=${limit}&search=${search}&categoryId=${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.error("Error fetching services:", error);
    return null;
  }
};

// Tạo một dịch vụ mới
export const createService = async (formData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.post(`${API_URL}/service`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    return null;
  }
};

// Cập nhật dịch vụ theo ID
export const updateService = async (id, formData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.put(`${API_URL}/service/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    return null;
  }
};

// Xóa dịch vụ theo ID
export const deleteService = async (id) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.delete(`${API_URL}/service/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    return null;
  }
};
