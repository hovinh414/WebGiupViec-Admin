import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Input, Table, Button, Pagination, Select, Popconfirm } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllServices, deleteService } from "services/serviceService";
import { getAllCategories } from "services/categoryService";
import { debounce } from "lodash";
import { message } from "antd";
import { formatCurrency } from "utils/formatCurrency";
import Card from "components/card/Card";
import CreateServiceModal from "./components/CreateServiceModal";
import EditServiceModal from "./components/EditServiceModal"; // Import EditServiceModal

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editServiceData, setEditServiceData] = useState(null); // State to hold the service being edited
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

  const fetchServices = useCallback(
    async (search = searchTerm, categoryId) => {
      setLoading(true);
      try {
        const data = await getAllServices(
          currentPage,
          limit,
          search,
          categoryId
        );
        if (data && data.services) {
          setServices(data.services);
          setTotalPages(data.totalPages);
        } else {
          setServices([]);
          setTotalPages(1);
        }
      } catch (error) {
        setServices([]);
        message.error("Không thể lấy danh sách dịch vụ.");
      }
      setLoading(false);
    },
    [currentPage, limit]
  );

  const fetchCategories = useCallback(async () => {
    const data = await getAllCategories();
    setCategories(data.categories || null);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const debouncedFetchServices = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchServices(value, categoryId);
    }, 800),
    [fetchServices]
  );

  useEffect(() => {
    fetchServices(searchTerm, categoryId);
  }, [fetchServices, currentPage, categoryId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    setCurrentPage(1);
  };

  const handleDeleteService = async (id) => {
    try {
      const response = await deleteService(id);
      if (response) {
        message.success("Dịch vụ đã được xóa thành công.");
        fetchServices(); // Refresh the list after deletion
      } else {
        message.error("Không thể xóa dịch vụ.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa dịch vụ.");
    }
  };

  const handleEditClick = (record) => {
    setEditServiceData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <img
          src={images && images.length ? images[0] : ""}
          alt="Service"
          style={{ borderRadius: "25%", width: "60px", height: "60px" }}
        />
      ),
    },
    {
      title: "Giá cơ bản",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (price) => (
        <span>{price ? `${formatCurrency(price)}` : "Không có"}</span>
      ),
    },
    {
      title: "Mô tả ngắn",
      dataIndex: "shortDescription",
      key: "shortDescription",
      ellipsis: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Danh mục",
      dataIndex: ["categoryId", "categoryName"],
      key: "category",
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button
            style={{
              backgroundColor: "#FF8000",
              borderColor: "#FF8000",
              color: "white",
            }}
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(record);
            }}
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dịch vụ này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDeleteService(record._id);
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="danger" onClick={(e) => e.stopPropagation()}>
              Xóa
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
            Quản lý Dịch vụ
          </Text>
        </Flex>

        <Flex justifyContent="space-between" mb="20px" alignItems="center">
          <Input
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchServices(e.target.value);
            }}
            style={{ width: "50%", height: "40px" }}
          />

          <Select
            placeholder="Lọc theo danh mục"
            value={categoryId}
            onChange={(value) => {
              handleCategoryChange(value);
              fetchServices(searchTerm, value);
            }}
            style={{ width: "30%", height: "40px" }}
          >
            <Select.Option value="">Tất cả Danh mục</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.categoryName}
              </Select.Option>
            ))}
          </Select>

          <ChakraButton colorScheme="brand" onClick={onCreateOpen}>
            Thêm mới
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
              dataSource={services}
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

        <CreateServiceModal
          isOpen={isCreateOpen}
          onClose={onCreateClose}
          fetchServices={fetchServices}
        />

        <EditServiceModal
          isOpen={isEditOpen}
          onClose={() => {
            onEditClose();
            setEditServiceData(null);
          }}
          serviceData={editServiceData}
          fetchServices={fetchServices}
        />
      </Card>
    </Box>
  );
}
