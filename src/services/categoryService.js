import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

export const getAllCategories = async (page, limit, search = "") => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;

    const response = await axios.get(`${API_URL}/category`, {
      params: { page, limit, search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.payload;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      categories: [],
      currentPage: 1,
      totalPages: 1,
      totalCategories: 0,
    };
  }
};

export const createCategory = async (formData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;

    const response = await axios.post(`${API_URL}/category`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (categoryId, formData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;

    const response = await axios.put(
      `${API_URL}/category/${categoryId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
export const deleteCategory = async (categoryId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;

    const response = await axios.delete(`${API_URL}/category/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
