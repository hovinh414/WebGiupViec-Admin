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
  Text,
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

  // Error states for each input field
  const [errors, setErrors] = useState({
    categoryName: "",
    description: "",
    image: "",
  });

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors({ ...errors, image: "Vui lòng chọn hình ảnh nhỏ hơn 5MB." });
        return;
      }

      setNewCategory({
        ...newCategory,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
      setErrors({ ...errors, image: "" }); // Clear image error if valid
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { categoryName: "", description: "", image: "" };

    if (!newCategory.categoryName) {
      newErrors.categoryName = "Vui lòng nhập tên danh mục.";
      valid = false;
    }

    if (!newCategory.description) {
      newErrors.description = "Vui lòng nhập mô tả.";
      valid = false;
    }

    if (!newCategory.image) {
      newErrors.image = "Vui lòng tải lên hình ảnh.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

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
            {errors.categoryName && (
              <Text color="red.500" fontSize="sm">
                {errors.categoryName}
              </Text>
            )}
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
            {errors.description && (
              <Text color="red.500" fontSize="sm">
                {errors.description}
              </Text>
            )}
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
            {errors.image && (
              <Text color="red.500" fontSize="sm">
                {errors.image}
              </Text>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="brand"
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
