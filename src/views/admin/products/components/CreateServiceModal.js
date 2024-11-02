import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Input, Select, Upload, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import { createService } from "services/serviceService";
import { getAllCategories } from "services/categoryService";
import ReactQuill from "react-quill";

const { TextArea } = Input;

export default function CreateServiceModal({ isOpen, onClose, fetchServices }) {
  const [newService, setNewService] = useState({
    serviceName: "",
    categoryId: "",
    shortDescription: "",
    fullDescription: "",
    basePrice: "",
    address: "",
    images: [],
    tasks: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    serviceName: "",
    categoryId: "",
    shortDescription: "",
    fullDescription: "",
    basePrice: "",
    address: "",
    images: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data.categories || []);
    };
    fetchCategories();
  }, []);

  const handleFileChange = ({ fileList }) => {
    const updatedFileList = fileList.map((file) => ({
      ...file,
      originFileObj: file.originFileObj || file,
    }));
    setNewService({ ...newService, images: updatedFileList });
    setErrors({ ...errors, images: "" });
  };

  const handleAddTask = () => {
    setNewService({
      ...newService,
      tasks: [...newService.tasks, { title: "", taskList: [] }],
    });
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = newService.tasks.filter((_, i) => i !== index);
    setNewService({ ...newService, tasks: updatedTasks });
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...newService.tasks];
    updatedTasks[index][field] = value;
    setNewService({ ...newService, tasks: updatedTasks });
  };

  const handleAddTaskItem = (taskIndex) => {
    const updatedTasks = [...newService.tasks];
    if (!Array.isArray(updatedTasks[taskIndex].taskList)) {
      updatedTasks[taskIndex].taskList = [];
    }
    updatedTasks[taskIndex].taskList.push("");
    setNewService({ ...newService, tasks: updatedTasks });
  };

  const handleRemoveTaskItem = (taskIndex, itemIndex) => {
    const updatedTasks = [...newService.tasks];
    if (Array.isArray(updatedTasks[taskIndex].taskList)) {
      updatedTasks[taskIndex].taskList.splice(itemIndex, 1);
    }
    setNewService({ ...newService, tasks: updatedTasks });
  };

  const handleTaskItemChange = (taskIndex, itemIndex, value) => {
    const updatedTasks = [...newService.tasks];
    if (Array.isArray(updatedTasks[taskIndex].taskList)) {
      updatedTasks[taskIndex].taskList[itemIndex] = value;
    }
    setNewService({ ...newService, tasks: updatedTasks });
  };

  const validateFields = () => {
    const newErrors = {
      serviceName: "",
      categoryId: "",
      shortDescription: "",
      fullDescription: "",
      basePrice: "",
      address: "",
      images: "",
    };

    let isValid = true;

    if (!newService.serviceName) {
      newErrors.serviceName = "Vui lòng nhập tên dịch vụ.";
      isValid = false;
    }
    if (!newService.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục.";
      isValid = false;
    }
    if (!newService.shortDescription) {
      newErrors.shortDescription = "Vui lòng nhập mô tả ngắn.";
      isValid = false;
    }
    if (!newService.fullDescription) {
      newErrors.fullDescription = "Vui lòng nhập mô tả chi tiết.";
      isValid = false;
    }
    if (!newService.basePrice) {
      newErrors.basePrice = "Vui lòng nhập giá cơ bản.";
      isValid = false;
    }
    if (!newService.address) {
      newErrors.address = "Vui lòng chọn địa chỉ.";
      isValid = false;
    }
    if (!newService.images.length) {
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("serviceName", newService.serviceName);
    formData.append("categoryId", newService.categoryId);
    formData.append("shortDescription", newService.shortDescription);
    formData.append("fullDescription", newService.fullDescription);
    formData.append("basePrice", newService.basePrice);
    formData.append("address", newService.address);

    newService.images.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    });

    formData.append("tasks", JSON.stringify(newService.tasks));

    try {
      const response = await createService(formData);
      if (response.success) {
        message.success("Dịch vụ đã được tạo thành công.");
        onClose();
        setNewService({
          serviceName: "",
          categoryId: "",
          shortDescription: "",
          fullDescription: "",
          basePrice: "",
          address: "",
          images: [],
          tasks: [],
        });
        fetchServices();
      }
    } catch (error) {
      message.error("Không thể tạo dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Dịch vụ Mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tên dịch vụ:
            </label>
            <Input
              placeholder="Nhập tên dịch vụ"
              value={newService.serviceName}
              onChange={(e) =>
                setNewService({ ...newService, serviceName: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.serviceName && (
              <Text color="red.500" fontSize="sm">
                {errors.serviceName}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Danh mục:
            </label>
            <Select
              placeholder="Chọn danh mục"
              onChange={(value) =>
                setNewService({ ...newService, categoryId: value })
              }
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {categories.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.categoryName}
                </Select.Option>
              ))}
            </Select>
            {errors.categoryId && (
              <Text color="red.500" fontSize="sm">
                {errors.categoryId}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả ngắn:
            </label>
            <TextArea
              placeholder="Nhập mô tả ngắn"
              value={newService.shortDescription}
              onChange={(e) =>
                setNewService({
                  ...newService,
                  shortDescription: e.target.value,
                })
              }
              style={{ height: "40px" }}
            />
            {errors.shortDescription && (
              <Text color="red.500" fontSize="sm">
                {errors.shortDescription}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả chi tiết:
            </label>
            <ReactQuill
              theme="snow"
              value={newService.fullDescription}
              onChange={(content) =>
                setNewService({ ...newService, fullDescription: content })
              }
              style={{ height: "200px" }}
            />
            {errors.fullDescription && (
              <Text color="red.500" fontSize="sm">
                {errors.fullDescription}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16, marginTop: 50 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Giá dự tính:
            </label>
            <Input
              type="number"
              placeholder="Nhập giá cơ bản"
              value={newService.basePrice}
              onChange={(e) =>
                setNewService({ ...newService, basePrice: e.target.value })
              }
              style={{ height: "40px" }}
            />
            {errors.basePrice && (
              <Text color="red.500" fontSize="sm">
                {errors.basePrice}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Địa chỉ:
            </label>
            <Select
              placeholder="Chọn địa chỉ"
              value={newService.address}
              onChange={(value) =>
                setNewService({ ...newService, address: value })
              }
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option value="Hà Nội">Hà Nội</Select.Option>
              <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
              <Select.Option value="Thành phố Hồ Chí Minh">
                Thành phố Hồ Chí Minh
              </Select.Option>
            </Select>
            {errors.address && (
              <Text color="red.500" fontSize="sm">
                {errors.address}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Hình ảnh:
            </label>
            <Upload
              listType="picture-card"
              fileList={newService.images}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              {newService.images.length < 5 && <PlusOutlined />}
            </Upload>
            {errors.images && (
              <Text color="red.500" fontSize="sm">
                {errors.images}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tasks:
            </label>
            <Button onClick={handleAddTask} style={{ marginBottom: "10px" }}>
              Thêm Task
            </Button>
            {newService.tasks.map((task, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 10,
                  padding: "10px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Input
                    placeholder="Nhập tiêu đề Task"
                    value={task.title}
                    onChange={(e) =>
                      handleTaskChange(index, "title", e.target.value)
                    }
                    style={{ width: "80%", height: "40px" }}
                  />
                  <Button
                    type="text"
                    danger
                    onClick={() => handleRemoveTask(index)}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>

                {task.taskList.map((taskItem, itemIndex) => (
                  <div
                    key={itemIndex}
                    style={{ display: "flex", marginBottom: "8px" }}
                  >
                    <Input
                      placeholder="Nhập công việc"
                      value={taskItem}
                      onChange={(e) =>
                        handleTaskItemChange(index, itemIndex, e.target.value)
                      }
                      style={{ width: "85%", height: "40px" }}
                    />
                    <Button
                      type="text"
                      danger
                      onClick={() => handleRemoveTaskItem(index, itemIndex)}
                    >
                      <DeleteOutlined />
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  style={{ width: "100%" }}
                  onClick={() => handleAddTaskItem(index)}
                >
                  Thêm Công việc
                </Button>
              </div>
            ))}
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
