import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  CircularProgress,
  useColorModeValue,
  Text,
  Divider,
} from "@chakra-ui/react";
import { Table, Pagination, Popconfirm, Button, Modal, message } from "antd";
import Card from "components/card/Card";
import {
  getAllInactiveStaffAccounts,
  approveAccount,
  rejectAccount,
} from "services/userService";

export default function ProfileApprovalManagement() {
  const [inactiveStaffAccounts, setInactiveStaffAccounts] = useState([]);
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const [staffTotalPages, setStaffTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null); // Thông tin tài khoản được chọn
  const limit = 5;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const fetchInactiveStaffAccounts = async (page = staffCurrentPage) => {
    setLoading(true);
    try {
      const data = await getAllInactiveStaffAccounts(page, limit);
      const { inactiveStaffAccounts, totalPages, currentPage } = data.payload;
      setInactiveStaffAccounts(inactiveStaffAccounts);
      setStaffTotalPages(totalPages);
      setStaffCurrentPage(currentPage);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách tài khoản staff chưa kích hoạt.");
    }
    setLoading(false);
  };

  const handleApprove = async (userId) => {
    try {
      await approveAccount(userId);
      message.success("Tài khoản đã được phê duyệt.");
      fetchInactiveStaffAccounts();
    } catch (error) {
      message.error("Lỗi khi phê duyệt tài khoản.");
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectAccount(userId);
      message.success("Tài khoản đã bị từ chối.");
      fetchInactiveStaffAccounts();
    } catch (error) {
      message.error("Lỗi khi từ chối tài khoản.");
    }
  };

  useEffect(() => {
    fetchInactiveStaffAccounts();
  }, []);

  const handleStaffPageChange = (page) => {
    fetchInactiveStaffAccounts(page);
  };

  const showModal = (account) => {
    setSelectedAccount(account);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedAccount(null);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} w="100%">
      <Card
        direction="column"
        w="100%"
        px="25px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex justify="space-between" mb="15px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Quản Lý Phê Duyệt Hồ Sơ
          </Text>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <>
            <Table
              columns={[
                {
                  title: "Tên Nhân Viên",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  key: "email",
                },
                {
                  title: "Số Điện Thoại",
                  dataIndex: "phone",
                  key: "phone",
                },
                {
                  title: "Tuổi",
                  dataIndex: "age",
                  key: "age",
                },
                {
                  title: "CV",
                  dataIndex: "cv",
                  key: "cv",
                  render: (cv, record) => (
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn xung đột sự kiện click của hàng
                        showModal(record); // Truyền record vào để mở Modal với CV và thông tin chi tiết
                      }}
                    >
                      Xem CV
                    </Button>
                  ),
                },
                {
                  title: "Thao Tác",
                  key: "actions",
                  render: (text, record) => (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Popconfirm
                        title="Bạn có chắc muốn phê duyệt tài khoản này không?"
                        onConfirm={() => handleApprove(record._id)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: "green",
                            borderColor: "green",
                          }}
                        >
                          Phê Duyệt
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title="Bạn có chắc muốn từ chối tài khoản này không?"
                        onConfirm={() => handleReject(record._id)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <Button type="primary" danger>
                          Từ Chối
                        </Button>
                      </Popconfirm>
                    </div>
                  ),
                },
              ]}
              dataSource={inactiveStaffAccounts}
              rowKey={(record) => record._id}
              pagination={false}
            />
            <Pagination
              current={staffCurrentPage}
              total={staffTotalPages * limit}
              pageSize={limit}
              onChange={handleStaffPageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </Card>

      {/* Modal hiển thị chi tiết tài khoản */}
      <Modal
        title="Chi Tiết Tài Khoản"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={1000} // Tăng kích thước modal
        bodyStyle={{ padding: "20px 30px" }}
      >
        {selectedAccount && (
          <Flex direction="row" gap="30px">
            {/* Cột thông tin cá nhân */}
            <Box flex="1">
              <Text fontSize="20px" fontWeight="bold" mb="15px">
                Thông Tin Cá Nhân
              </Text>
              <Divider mb="10px" />
              <Text fontSize="16px" mb="10px">
                <strong>Tên Nhân Viên:</strong> {selectedAccount.name}
              </Text>
              <Text fontSize="16px" mb="10px">
                <strong>Email:</strong> {selectedAccount.email}
              </Text>
              <Text fontSize="16px" mb="10px">
                <strong>Số Điện Thoại:</strong> {selectedAccount.phone}
              </Text>
              <Text fontSize="16px" mb="10px">
                <strong>Tuổi:</strong> {selectedAccount.age}
              </Text>
            </Box>

            {/* Cột hiển thị CV */}
            <Box flex="2">
              <Text fontSize="20px" fontWeight="bold" mb="15px">
                Tài Liệu CV
              </Text>
              <Divider mb="10px" />
              {selectedAccount.cv ? (
                <iframe
                  src={selectedAccount.cv}
                  width="100%"
                  height="500px"
                  title="CV Viewer"
                  style={{ border: "1px solid #ddd", borderRadius: "8px" }}
                />
              ) : (
                <Text color="red.500">Không có CV</Text>
              )}
            </Box>
          </Flex>
        )}
      </Modal>
    </Box>
  );
}
