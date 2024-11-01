import { Box, Flex, CircularProgress, Text } from "@chakra-ui/react";
import {
  Table,
  Pagination,
  Button,
  Input,
  message,
  Popconfirm,
  Modal,
  InputNumber,
  Avatar,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllBookings,
  changeStatusBooking,
  completeBooking,
} from "services/bookingService";
import { debounce } from "lodash";
import Card from "components/card/Card";
import { formatCurrency } from "utils/formatCurrency";
import BookingDetailModal from "./components/BookingDetailModal";

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

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [currentDetailBooking, setCurrentDetailBooking] = useState(null);
  const [actualAmountReceived, setActualAmountReceived] = useState(0);
  const [actionLoading, setActionLoading] = useState(false); // Loading state for actions
  const limit = 5;

  const fetchBookingsData = useCallback(
    async (search = searchTerm) => {
      try {
        setLoading(true);
        const data = await getAllBookings(currentPage, limit, search);
        setBookings(data.bookings);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Không tìm thấy lịch hẹn nào", error);
        setLoading(false);
        setBookings([]);
      }
    },
    [currentPage, limit, searchTerm]
  );

  const debouncedFetchBookings = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchBookingsData(value);
    }, 800),
    [fetchBookingsData]
  );

  useEffect(() => {
    fetchBookingsData(searchTerm);
  }, [fetchBookingsData, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await changeStatusBooking(bookingId, status, rejectionReason);
      message.success(
        `Đã ${status === "approved" ? "xác nhận" : "từ chối"} lịch hẹn`
      );
      fetchBookingsData();
    } catch (error) {
      message.error("Thay đổi trạng thái lịch hẹn thất bại");
    }
  };

  const handleCompleteBooking = async () => {
    setActionLoading(true); // Start loading for completion action
    const completionTime = new Date();

    try {
      await completeBooking(
        currentBookingId,
        actualAmountReceived,
        completionTime
      );
      message.success("Lịch hẹn đã được hoàn tất");
      fetchBookingsData();
      setIsCompleteModalVisible(false);
      setActualAmountReceived(0); // Reset actual amount
    } catch (error) {
      message.error("Hoàn tất lịch hẹn thất bại");
    } finally {
      setActionLoading(false); // Stop loading after action
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối.");
      return;
    }
    setActionLoading(true); // Start loading for reject action
    await handleStatusChange(currentBookingId, "rejected");
    setIsRejectModalVisible(false);
    setRejectionReason("");
    setActionLoading(false); // Stop loading after action
  };

  const showRejectModal = (bookingId) => {
    setCurrentBookingId(bookingId);
    setIsRejectModalVisible(true);
  };

  const showCompleteModal = (bookingId) => {
    setCurrentBookingId(bookingId);
    setIsCompleteModalVisible(true);
  };

  const showDetailModal = (booking) => {
    setCurrentDetailBooking(booking);
    setIsDetailModalVisible(true);
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customerId",
      key: "customerId",
      render: (customer) => customer?.name,
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceId",
      key: "serviceName",
      render: (service) => (
        <Flex align="center">
          <Avatar
            src={service?.images[0] || "URL hình ảnh mặc định"} // URL ảnh mặc định nếu không có ảnh dịch vụ
            alt={service?.serviceName}
            size={40} // Tăng kích thước ảnh, có thể thay đổi kích thước theo nhu cầu
            style={{ marginRight: "8px" }}
          />
          <Text>{service?.serviceName}</Text>
        </Flex>
      ),
    },
    {
      title: "Nhân viên",
      dataIndex: "preferredStaffId",
      key: "preferredStaffId",
      render: (staff) => staff?.name || "Chưa chỉ định",
    },
    {
      title: "Thời gian đặt lịch",
      dataIndex: "bookingTime",
      key: "bookingTime",
      render: (text) =>
        new Date(text).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => generateStatus(status),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <>
          {record.status === "pending" && (
            <>
              <Popconfirm
                title="Xác nhận lịch hẹn này?"
                onConfirm={() => handleStatusChange(record._id, "approved")}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button
                  style={{
                    backgroundColor: "#FF8000",
                    borderColor: "#FF8000",
                    color: "white",
                    marginRight: "10px",
                  }}
                  type="primary"
                >
                  Xác nhận
                </Button>
              </Popconfirm>
              <Button
                type="danger"
                onClick={() => showRejectModal(record._id)}
                style={{ marginRight: "10px" }}
              >
                Từ chối
              </Button>
            </>
          )}
          {record.status === "approved" && (
            <Button
              style={{
                backgroundColor: "#FF8000",
                borderColor: "#FF8000",
                color: "white",
              }}
              type="primary"
              onClick={() => showCompleteModal(record._id)}
            >
              Hoàn tất
            </Button>
          )}
          <Button
            type="default"
            onClick={() => showDetailModal(record)}
            style={{ marginLeft: "10px" }}
          >
            Xem chi tiết
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} w="100%">
      <Card direction="column" w="100%" px="25px">
        <Flex justify="space-between" mb="15px" align="center">
          <Text fontSize="22px" fontWeight="700" lineHeight="100%">
            Quản lý lịch hẹn
          </Text>
        </Flex>

        <Flex justifyContent="space-between" mb="20px">
          <Input
            allowClear
            placeholder="Tìm kiếm theo tên khách hàng hoặc dịch vụ"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchBookings(e.target.value);
            }}
            style={{ width: "48%", height: "40px" }}
          />
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={bookings}
              pagination={false}
              rowKey={(record) => record._id}
              style={{ width: "100%", cursor: "pointer" }}
            />
            <Pagination
              current={currentPage}
              total={totalPages * limit}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </Card>

      <Modal
        title="Lý do từ chối lịch hẹn"
        visible={isRejectModalVisible}
        onOk={handleReject}
        onCancel={() => setIsRejectModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={actionLoading} // Loading for reject action
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </Modal>

      <Modal
        title="Hoàn tất lịch hẹn"
        visible={isCompleteModalVisible}
        onCancel={() => setIsCompleteModalVisible(false)}
        onOk={handleCompleteBooking}
        okText="Hoàn tất"
        cancelText="Hủy"
        confirmLoading={actionLoading} // Loading for complete action
      >
        <Text>Số tiền thực tế nhận:</Text>
        <InputNumber
          min={0}
          value={actualAmountReceived}
          onChange={(value) => setActualAmountReceived(value)}
          style={{ width: "100%", marginTop: "10px" }}
        />
      </Modal>

      <BookingDetailModal
        visible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
        booking={currentDetailBooking}
        fetchBookingsData={fetchBookingsData}
      />
    </Box>
  );
}
