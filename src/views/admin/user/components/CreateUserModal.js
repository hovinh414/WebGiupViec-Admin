import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Input, Select, message } from "antd";
import { createUser } from "services/userService";
import { getAllServices } from "services/serviceService";

export default function CreateUserModal({ isOpen, onClose, fetchUsers }) {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "Hà Nội",
    role: "customer",
    age: "",
    serviceIds: [],
    discountPercentage: 0, // Initialize discountPercentage
  });
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  // Fetch services if role is "staff"
  useEffect(() => {
    if (newUser.role === "staff") {
      (async () => {
        const servicesData = await getAllServices(1, 100); // Adjust limit as needed
        setServices(servicesData.services || []);
      })();
    }
  }, [newUser.role]);

  const handleSubmit = async () => {
    setLoading(true);
    if (!newUser.name || !newUser.email || !newUser.password) {
      message.warning("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      setLoading(false);
      return;
    }

    try {
      const response = await createUser(newUser);
      if (response) {
        message.success("Tạo người dùng thành công.");
        onClose();
        setNewUser({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "Hà Nội",
          role: "customer",
          age: "",
          serviceIds: [],
          discountPercentage: 0,
        });
        fetchUsers();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Tạo người dùng thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Người Dùng Mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Tên Người Dùng */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tên Người Dùng:
            </label>
            <Input
              allowClear
              placeholder="Nhập tên người dùng"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ height: "40px" }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Email:
            </label>
            <Input
              allowClear
              placeholder="Nhập email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              style={{ height: "40px" }}
            />
          </div>

          {/* Mật Khẩu */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Mật Khẩu:
            </label>
            <Input.Password
              allowClear
              placeholder="Nhập mật khẩu"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              style={{ height: "40px" }}
            />
          </div>

          {/* Số Điện Thoại */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Số Điện Thoại:
            </label>
            <Input
              allowClear
              placeholder="Nhập số điện thoại"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
              style={{ height: "40px" }}
            />
          </div>

          {/* Địa Chỉ */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Địa Chỉ:
            </label>
            <Select
              value={newUser.address}
              onChange={(value) => setNewUser({ ...newUser, address: value })}
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option value="Hà Nội">Hà Nội</Select.Option>
              <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
              <Select.Option value="Thành phố Hồ Chí Minh">
                Thành phố Hồ Chí Minh
              </Select.Option>
            </Select>
          </div>

          {/* Vai Trò */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Vai Trò:
            </label>
            <Select
              value={newUser.role}
              onChange={(value) =>
                setNewUser({
                  ...newUser,
                  role: value,
                  serviceIds: value === "staff" ? newUser.serviceIds : [],
                })
              }
              style={{ width: "100%", height: "40px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option value="customer">Customer</Select.Option>
              <Select.Option value="staff">Staff</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
            </Select>
          </div>

          {/* Dịch Vụ (chỉ hiển thị nếu vai trò là staff) */}
          {newUser.role === "staff" && (
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Dịch Vụ:
              </label>
              <Select
                mode="multiple"
                placeholder="Chọn dịch vụ"
                value={newUser.serviceIds}
                onChange={(value) =>
                  setNewUser({ ...newUser, serviceIds: value })
                }
                style={{ width: "100%" }}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {services.map((service) => (
                  <Select.Option key={service._id} value={service._id}>
                    {service.serviceName}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {/* Tuổi */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Tuổi:
            </label>
            <Input
              type="number"
              placeholder="Nhập tuổi"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
              style={{ height: "40px" }}
            />
          </div>

          {/* Chiết Khấu (%) */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
            >
              Chiết Khấu (%):
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="Nhập chiết khấu"
              value={newUser.discountPercentage}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  discountPercentage: e.target.value,
                })
              }
              style={{ height: "40px" }}
            />
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
