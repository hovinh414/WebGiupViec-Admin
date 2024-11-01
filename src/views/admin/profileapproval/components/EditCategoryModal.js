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
import { Input, message } from "antd";
import React, { useState, useEffect } from "react";
import { updateCategory } from "services/categoryService";

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  fetchCategories,
}) {
  const [editCategory, setEditCategory] = useState({
    categoryName: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setEditCategory({
        categoryName: category.categoryName,
        description: category.description,
        image: null,
      });
      setPreviewImage(category.images || "https://via.placeholder.com/150");
    }
  }, [category]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        message.warning("Vui lòng chọn hình ảnh nhỏ hơn 5MB.");
      } else {
        setEditCategory({ ...editCategory, image: file });
        setPreviewImage(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async () => {
    if (!editCategory.categoryName) {
      message.warning("Vui lòng nhập tên danh mục.");
      return;
    }
    if (!editCategory.description) {
      message.warning("Vui lòng nhập mô tả.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("categoryName", editCategory.categoryName);
    formData.append("description", editCategory.description);
    if (editCategory.image) {
      formData.append("image", editCategory.image);
    }

    try {
      await updateCategory(category._id, formData);

      message.success("Cập nhật danh mục thành công");

      fetchCategories();

      onClose();
    } catch (error) {
      message.error(
        error.response.data.message || "Cập nhật danh mục thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa Danh mục</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tên Danh mục:
            </label>
            <Input
              placeholder="Nhập tên danh mục"
              value={editCategory.categoryName}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  categoryName: e.target.value,
                })
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
              value={editCategory.description}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
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
              Hình ảnh hiện tại:
            </label>
            <Image
              src={previewImage}
              alt="Category"
              boxSize="150px"
              objectFit="cover"
              borderRadius="8px"
            />
          </div>

          <div>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tải lên hình ảnh mới:
            </label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={loading}
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
          >
            Lưu
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
