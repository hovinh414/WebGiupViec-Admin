// Import thư viện và URL cơ bản
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};

// API lấy tất cả các booking có phân trang và tìm kiếm
export const getAllBookings = async (page, limit, search = "") => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/booking`, {
      params: { page, limit, search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      bookings: [],
      currentPage: 1,
      totalPages: 1,
      totalBookings: 0,
    };
  }
};

// API tạo booking
export const createBooking = async (bookingData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/booking`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// API thay đổi trạng thái booking
export const changeStatusBooking = async (
  bookingId,
  status,
  rejectionReason
) => {
  try {
    const token = getToken();
    const response = await axios.patch(
      `${API_URL}/booking/${bookingId}/status`,
      { status, rejectionReason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing booking status:", error);
    throw error;
  }
};

// API lấy booking theo ID
export const getBookingById = async (bookingId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw error;
  }
};

// API gửi email xác nhận cho khách hàng
export const sendCustomerEmail = async (bookingId) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/booking/${bookingId}/send-customer-email`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending customer email:", error);
    throw error;
  }
};

// API gửi email cho nhân viên được book
export const sendStaffEmail = async (bookingId) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/booking/${bookingId}/send-staff-email`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending staff email:", error);
    throw error;
  }
};
// API lấy lịch sử booking của nhân viên theo ID
export const getBookingByStaffId = async (staffId, page = 1, limit = 10) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/booking/staff/${staffId}`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching bookings by staff ID:", error);
    return {
      bookings: [],
      currentPage: 1,
      totalPages: 1,
      totalBookings: 0,
    };
  }
};
export const completeBooking = async (
  bookingId,
  actualAmountReceived,
  completionTime
) => {
  try {
    const token = getToken();
    const response = await axios.patch(
      `${API_URL}/booking/${bookingId}/complete`,
      { actualAmountReceived, completionTime },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error completing booking:", error);
    throw error;
  }
};
export const changeBookingStaff = async (bookingId, staffData) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/booking/change-staff/${bookingId}`,
      staffData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thay đổi nhân viên trong booking:", error);
    throw error;
  }
};
