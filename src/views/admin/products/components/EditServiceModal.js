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
import { updateService } from "services/serviceService";
import { getAllCategories } from "services/categoryService";
import ReactQuill from "react-quill";

export default function EditServiceModal({
  isOpen,
  onClose,
  serviceData,
  fetchServices,
}) {
  const [editService, setEditService] = useState({
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
  console.log(serviceData);
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data.categories || []);
    };
    fetchCategories();

    if (serviceData) {
      setEditService({
        serviceName: serviceData.serviceName,
        categoryId: serviceData.categoryId._id,
        shortDescription: serviceData.shortDescription,
        fullDescription: serviceData.fullDescription,
        basePrice: serviceData.basePrice,
        address: serviceData.address,
        images: serviceData.images.map((url, index) => ({
          uid: index,
          url,
        })),
        tasks: serviceData.tasks,
      });
    }
  }, [serviceData]);

  const handleFileChange = ({ fileList }) => {
    setEditService({ ...editService, images: fileList });
  };

  const handleAddTask = () => {
    setEditService({
      ...editService,
      tasks: [...editService.tasks, { title: "", taskList: [] }],
    });
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = editService.tasks.filter((_, i) => i !== index);
    setEditService({ ...editService, tasks: updatedTasks });
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...editService.tasks];
    updatedTasks[index][field] = value;
    setEditService({ ...editService, tasks: updatedTasks });
  };

  const handleAddTaskItem = (taskIndex) => {
    const updatedTasks = [...editService.tasks];
    if (!Array.isArray(updatedTasks[taskIndex].taskList)) {
      updatedTasks[taskIndex].taskList = [];
    }
    updatedTasks[taskIndex].taskList.push("");
    setEditService({ ...editService, tasks: updatedTasks });
  };

  const handleRemoveTaskItem = (taskIndex, itemIndex) => {
    const updatedTasks = [...editService.tasks];
    if (Array.isArray(updatedTasks[taskIndex].taskList)) {
      updatedTasks[taskIndex].taskList.splice(itemIndex, 1);
    }
    setEditService({ ...editService, tasks: updatedTasks });
  };

  const handleTaskItemChange = (taskIndex, itemIndex, value) => {
    const updatedTasks = [...editService.tasks];
    if (Array.isArray(updatedTasks[taskIndex].taskList)) {
      updatedTasks[taskIndex].taskList[itemIndex] = value;
    }
    setEditService({ ...editService, tasks: updatedTasks });
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (
      !editService.serviceName ||
      !editService.categoryId ||
      !editService.basePrice
    ) {
      message.warning("Vui lòng điền đầy đủ các trường bắt buộc.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("serviceName", editService.serviceName);
    formData.append("categoryId", editService.categoryId);
    formData.append("shortDescription", editService.shortDescription);
    formData.append("fullDescription", editService.fullDescription);
    formData.append("basePrice", editService.basePrice);
    formData.append("address", editService.address);
    editService.images.forEach((file) => {
      // Kiểm tra nếu là tệp mới, thêm originFileObj
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      } else {
        // Thêm URL nếu không phải tệp mới
        formData.append("images", file.url);
      }
    });

    formData.append("tasks", JSON.stringify(editService.tasks));

    try {
      const response = await updateService(serviceData._id, formData);
      if (response.success) {
        message.success("Dịch vụ đã được cập nhật thành công.");
        onClose();
        fetchServices();
      }
    } catch (error) {
      message.error("Không thể cập nhật dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa Dịch vụ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Tên dịch vụ */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tên dịch vụ:
            </label>
            <Input
              placeholder="Nhập tên dịch vụ"
              value={editService.serviceName}
              onChange={(e) =>
                setEditService({ ...editService, serviceName: e.target.value })
              }
              style={{ height: "40px" }}
            />
          </div>

          {/* Danh mục */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Danh mục:
            </label>
            <ChakraSelect
              placeholder="Chọn danh mục"
              value={editService.categoryId}
              onChange={(e) =>
                setEditService({ ...editService, categoryId: e.target.value })
              }
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </ChakraSelect>
          </div>

          {/* Mô tả ngắn */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả ngắn:
            </label>
            <Input
              placeholder="Nhập mô tả ngắn"
              value={editService.shortDescription}
              onChange={(e) =>
                setEditService({
                  ...editService,
                  shortDescription: e.target.value,
                })
              }
              style={{ height: "40px" }}
            />
          </div>

          {/* Mô tả chi tiết */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mô tả chi tiết:
            </label>
            <ReactQuill
              theme="snow"
              value={editService.fullDescription}
              onChange={(content) =>
                setEditService({ ...editService, fullDescription: content })
              }
              style={{ height: "200px" }}
            />
          </div>

          {/* Giá cơ bản */}
          <div style={{ marginBottom: 16, marginTop: 50 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Giá cơ bản:
            </label>
            <Input
              type="number"
              placeholder="Nhập giá cơ bản"
              value={editService.basePrice}
              onChange={(e) =>
                setEditService({ ...editService, basePrice: e.target.value })
              }
              style={{ height: "40px" }}
            />
          </div>

          {/* Địa chỉ */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Địa chỉ:
            </label>
            <Input
              placeholder="Nhập địa chỉ"
              value={editService.address}
              onChange={(e) =>
                setEditService({ ...editService, address: e.target.value })
              }
              style={{ height: "40px" }}
            />
          </div>

          {/* Hình ảnh */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Hình ảnh:
            </label>
            <Upload
              listType="picture-card"
              fileList={editService.images}
              onChange={handleFileChange}
              beforeUpload={() => false}
            >
              {editService.images.length < 5 && <PlusOutlined />}
            </Upload>
          </div>

          {/* Tasks */}
          <div>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tasks:
            </label>
            <Button onClick={handleAddTask} style={{ marginBottom: "10px" }}>
              Thêm Task
            </Button>
            {editService.tasks.map((task, index) => (
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
            colorScheme="brand"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Cập nhật
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
