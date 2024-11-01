import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  Select as ChakraSelect,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Input, message, Upload } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import { createService } from "services/serviceService";
import { getAllCategories } from "services/categoryService";
import ReactQuill from "react-quill";

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
      originFileObj: file.originFileObj || file, // Giữ lại originFileObj cho file mới
    }));
    setNewService({ ...newService, images: updatedFileList });
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

  const handleSubmit = async () => {
    setLoading(true);

    if (
      !newService.serviceName ||
      !newService.categoryId ||
      !newService.basePrice
    ) {
      message.warning("Vui lòng điền đầy đủ các trường bắt buộc.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("serviceName", newService.serviceName);
    formData.append("categoryId", newService.categoryId);
    formData.append("shortDescription", newService.shortDescription);
    formData.append("fullDescription", newService.fullDescription);
    formData.append("basePrice", newService.basePrice);
    formData.append("address", newService.address);

    newService.images.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj); // Sử dụng originFileObj
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
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Danh mục:
            </label>
            <ChakraSelect
              placeholder="Chọn danh mục"
              onChange={(e) =>
                setNewService({ ...newService, categoryId: e.target.value })
              }
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </ChakraSelect>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả ngắn:
            </label>
            <Input
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
          </div>

          <div style={{ marginBottom: 16, marginTop: 50 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Giá cơ bản:
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
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Địa chỉ:
            </label>
            <Input
              placeholder="Nhập địa chỉ"
              value={newService.address}
              onChange={(e) =>
                setNewService({ ...newService, address: e.target.value })
              }
              style={{ height: "40px" }}
            />
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
          </div>

          <div>
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
                    style={{ width: "80%" }}
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
                      style={{ width: "85%" }}
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
