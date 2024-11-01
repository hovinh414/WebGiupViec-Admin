import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Tag,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllUser, lockUser } from "services/userService";
import { debounce } from "lodash";
import Card from "components/card/Card";
import EditUserModal from "./components/EditUserModal";
import CreateUserModal from "./components/CreateUserModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUserData, setEditUserData] = useState(null);
  const limit = 5;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const fetchUsers = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      const data = await getAllUser(page, limit, search);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setLoading(false);
    },
    [currentPage, limit]
  );

  const debouncedFetchUsers = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchUsers(value, 1);
    }, 800),
    [fetchUsers]
  );

  useEffect(() => {
    fetchUsers(searchTerm, currentPage);
  }, [fetchUsers, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditUserData(record);
    onEditOpen();
  };

  const confirmLockUser = async (userId) => {
    try {
      await lockUser(userId);
      message.success("User locked.");
      fetchUsers();
    } catch (error) {
      message.error("Error locking user.");
    }
  };

  const renderRoleTag = (role) => {
    let color = "";
    let label = "";

    switch (role) {
      case "admin":
        color = "blue";
        label = "Admin";
        break;
      case "staff":
        color = "green";
        label = "Staff";
        break;
      case "customer":
        color = "orange";
        label = "Customer";
        break;
      case "manager":
        color = "purple";
        label = "Manager";
        break;
      default:
        color = "gray";
        label = "Unknown";
    }

    return <Tag color={color}>{label}</Tag>;
  };

  const columns = [
    {
      title: "Tên Người Dùng",
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
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
      render: (age) => <span>{age || "Chưa cập nhật"}</span>, // Hiển thị Không có nếu không có tuổi
    },
    {
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
      render: (role) => renderRoleTag(role),
    },
    {
      title: "Trạng Thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <span style={{ color: active ? "green" : "red", fontWeight: "bold" }}>
          {active ? "Hoạt Động" : "Đã Khóa"}
        </span>
      ),
    },
    {
      title: "Chiết Khấu (%)",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      render: (discountPercentage) => (
        <span>{discountPercentage ? `${discountPercentage}%` : "Chưa cập nhật"}</span>
      ), // Hiển thị phần trăm hoặc "Không có" nếu không có
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(record);
            }}
          >
            Chỉnh Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn khóa người dùng này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              confirmLockUser(record._id);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="danger"
              style={{ marginLeft: "10px" }}
              onClick={(e) => e.stopPropagation()}
            >
              Khóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
            Quản Lý Người Dùng
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm người dùng..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchUsers(e.target.value);
            }}
            style={{ width: "85%" }}
          />
          <ChakraButton colorScheme="blue" onClick={onCreateOpen}>
            Thêm Mới
          </ChakraButton>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={users}
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
            <CreateUserModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchUsers={fetchUsers}
            />

            {editUserData && (
              <EditUserModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                user={editUserData}
                fetchUsers={fetchUsers}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
