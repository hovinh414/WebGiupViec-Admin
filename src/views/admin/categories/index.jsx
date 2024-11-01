import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Table, Button, Popconfirm, Pagination, Input } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllCategories, deleteCategory } from "services/categoryService";
import { debounce } from "lodash";
import { message } from "antd";
import Card from "components/card/Card";
import EditCategoryModal from "./components/EditCategoryModal";
import CreateCategoryModal from "./components/CreateCategoryModal";

export default function Settings() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editCategoryData, setEditCategoryData] = useState(null);
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

  const fetchCategories = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      const data = await getAllCategories(page, limit, search);
      setCategories(data.categories);
      setTotalPages(data.totalPages);
      setLoading(false);
    },
    [currentPage, limit]
  );

  const debouncedFetchCategories = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchCategories(value, 1);
    }, 800),
    [fetchCategories]
  );

  useEffect(() => {
    fetchCategories(searchTerm, currentPage);
  }, [fetchCategories, currentPage]);

  const confirmDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      message.success("Category deleted.");
      fetchCategories();
    } catch (error) {
      message.error("Error deleting category.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditCategoryData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "images",
      key: "images",
      render: (text) => (
        <img
          src={text}
          alt="Category"
          width={50}
          height={50}
          style={{ borderRadius: "25%" }}
        />
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isDelete",
      key: "isDelete",
      render: (status) => (
        <span style={{ color: status ? "red" : "green", fontWeight: "bold" }}>
          {status ? "Đã Xóa" : "Hoạt Động"}
        </span>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
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
            Chỉnh Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa danh mục này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              confirmDeleteCategory(record._id);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="danger"
              style={{ marginLeft: "10px" }}
              onClick={(e) => e.stopPropagation()}
            >
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
            Quản Lý Danh Mục
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm danh mục..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchCategories(e.target.value);
            }}
            style={{ width: "85%" }}
          />
          <ChakraButton colorScheme="brand" onClick={onCreateOpen}>
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
              dataSource={categories}
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
            <CreateCategoryModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchCategories={fetchCategories}
            />
            {editCategoryData && (
              <EditCategoryModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                category={editCategoryData}
                fetchCategories={fetchCategories}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
