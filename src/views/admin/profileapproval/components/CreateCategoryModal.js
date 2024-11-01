import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Input, message } from "antd";
import { createCategory } from "services/categoryService";

export default function CreateCategoryModal({
  isOpen,
  onClose,
  fetchCategories,
}) {
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    description: "",
    image: null,
    imagePreview: null,
  });

  const [loading, setLoading] = useState(false);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        message.warning("Vui lòng chọn hình ảnh nhỏ hơn 5MB.");
        return;
      }

      setNewCategory({
        ...newCategory,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!newCategory.categoryName) {
      message.warning("Vui lòng nhập tên danh mục.");
      setLoading(false);
      return;
    }

    if (!newCategory.description) {
      message.warning("Vui lòng nhập mô tả.");
      setLoading(false);
      return;
    }

    if (!newCategory.image) {
      message.warning("Vui lòng tải lên hình ảnh.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", newCategory.categoryName);
    formData.append("description", newCategory.description);
    formData.append("image", newCategory.image);

    try {
      const response = await createCategory(formData);
      if (response.success) {
        message.success("Tạo danh mục thành công.");
        onClose();
        setNewCategory({
          categoryName: "",
          description: "",
          image: null,
          imagePreview: null,
        });
        fetchCategories();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Tạo danh mục thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Danh mục Mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tên Danh mục:
            </label>
            <Input
              allowClear
              placeholder="Nhập tên danh mục"
              value={newCategory.categoryName}
              onChange={(e) =>
                setNewCategory({ ...newCategory, categoryName: e.target.value })
              }
              style={{ height: "40px" }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả:
            </label>
            <Input.TextArea
              allowClear
              placeholder="Nhập mô tả"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  description: e.target.value,
                })
              }
              rows={4}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Xem trước Hình ảnh:
            </label>
            <Image
              src={newCategory.imagePreview || PLACEHOLDER_IMAGE}
              alt="Category"
              boxSize="150px"
              objectFit="cover"
              mb={4}
              borderRadius="8px"
            />
          </div>

          <div>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tải lên Hình ảnh Danh mục:
            </label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Lưu
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
