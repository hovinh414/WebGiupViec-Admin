import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/work-schedule`;

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};
export const getAllWorkSchedule = async (userId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching work schedule by user ID:", error);
    throw error;
  }
};
// API tạo lịch làm việc
export const createWorkSchedule = async (workScheduleData) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/create-schedule`,
      workScheduleData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating work schedule:", error);
    throw error;
  }
};

// API cập nhật lịch làm việc theo userId
export const updateWorkSchedule = async (userId, workScheduleData) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/update-schedule/${userId}`,
      workScheduleData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating work schedule:", error);
    throw error;
  }
};

// API lấy lịch làm việc theo userId
export const getWorkScheduleByUserId = async (userId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/get-schedule/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching work schedule by user ID:", error);
    throw error;
  }
};

// API xóa lịch làm việc theo userId
export const deleteWorkSchedule = async (userId) => {
  try {
    const token = getToken();
    const response = await axios.delete(
      `${API_URL}/delete-schedule/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting work schedule:", error);
    throw error;
  }
};
