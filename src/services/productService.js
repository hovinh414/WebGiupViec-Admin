import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

export const getNewArrivals = async () => {
  try {
    const response = await axios.post(API_URL + "/product/get-by-flags", {
      isNewProduct: true,
    });

    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }
};

export const getSales = async () => {
  try {
    const response = await axios.post(API_URL + "/product/get-by-flags", {
      isSale: true,
    });

    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }
};
export const getAllProducts = async (
  page = 1,
  limit = 9,
  search = "",
  categoryId = ""
) => {
  console.log(categoryId);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;
  try {
    const response = await axios.get(
      `${API_URL}/product/admin?page=${page}&limit=${limit}&search=${search}&categoryId=${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};
export const getSpecials = async () => {
  try {
    const response = await axios.post(API_URL + "/product/get-by-flags", {
      isSpecial: true,
    });

    return response.data.payload;
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }
};
export const changeStatusProduct = async (productId, newStatus) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;
  try {
    const response = await axios.delete(
      `${API_URL}/product/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
      {
        isDelete: newStatus,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error changing product status:", error);
    return null;
  }
};
export const createProduct = async (formData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.post(`${API_URL}/product`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};
export const updateProduct = async (id, formData) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.accessToken : null;

  try {
    const response = await axios.put(`${API_URL}/product/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};
