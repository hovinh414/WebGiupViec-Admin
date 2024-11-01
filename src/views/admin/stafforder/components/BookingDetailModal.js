import React from "react";
import { Modal, Descriptions } from "antd";
import { formatCurrency } from "utils/formatCurrency";

const generateStatus = (status) => {
  let color = "";
  let displayText = "";
  switch (status) {
    case "pending":
      color = "#FF9900";
      displayText = "Đang chờ";
      break;
    case "approved":
      color = "#4CAF50";
      displayText = "Đã xác nhận";
      break;
    case "completed":
      color = "#008000";
      displayText = "Hoàn tất";
      break;
    case "rejected":
      color = "#FF0000";
      displayText = "Đã từ chối";
      break;
    case "canceled":
      color = "#D9534F";
      displayText = "Đã hủy";
      break;
    default:
      color = "gray";
      displayText = "Trạng thái khác";
  }

  return (
    <span
      style={{
        color: color,
        padding: "3px 8px",
        border: `1px solid ${color}`,
        borderRadius: "5px",
        backgroundColor: `${color}20`,
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {displayText}
    </span>
  );
};

const BookingDetailModal = ({ booking, visible, onClose }) => {
  if (!booking) return null;

  return (
    <Modal
      title="Chi tiết lịch hẹn"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Khách hàng">
          {booking.customerId?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Dịch vụ">
          {booking.serviceId?.serviceName}
        </Descriptions.Item>
        <Descriptions.Item label="Nhân viên">
          {booking.preferredStaffId?.name || "Không yêu cầu"}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian">
          {new Date(booking.bookingTime).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Chi phí dự kiến">
          {formatCurrency(booking.totalCost)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {generateStatus(booking.status)}
        </Descriptions.Item>
        <Descriptions.Item label="Số tiền thực tế nhận">
          {booking.actualAmountReceived
            ? formatCurrency(booking.actualAmountReceived)
            : "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian hoàn thành">
          {booking.completionTime
            ? new Date(booking.completionTime).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Chưa hoàn thành"}
        </Descriptions.Item>
        <Descriptions.Item label="Lý do từ chối">
          {booking.rejectionReason || "Không có"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BookingDetailModal;
