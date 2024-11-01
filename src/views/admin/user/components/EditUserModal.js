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
import { updateUser } from "services/userService";
import { getAllServices } from "services/serviceService";

export default function EditUserModal({ isOpen, onClose, user, fetchUsers }) {
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "Hà Nội",
    role: user?.role || "customer",
    age: user?.age || "",
    serviceIds: user?.serviceIds || [],
    discountPercentage: user?.discountPercentage || 0, // Initialize discountPercentage
  });
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  // Initialize userData when user changes
  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "Hà Nội",
      role: user?.role || "customer",
      age: user?.age || "",
      serviceIds: user?.serviceIds || [],
      discountPercentage: user?.discountPercentage || 0,
    });
  }, [user]);

  // Fetch services if role is "staff"
  useEffect(() => {
    if (userData.role === "staff") {
      (async () => {
        const servicesData = await getAllServices(1, 100);
        setServices(servicesData.services || []);
      })();
    }
  }, [userData.role]);

  const handleSubmit = async () => {
    setLoading(true);
    if (!userData.name || !userData.email) {
      message.warning("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      setLoading(false);
      return;
    }

    try {
      const response = await updateUser(user._id, userData);
      if (response) {
        message.success("Cập nhật người dùng thành công.");
        onClose();
        fetchUsers();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Cập nhật người dùng thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chỉnh sửa Người Dùng</ModalHeader>
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
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
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
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              style={{ height: "40px" }}
              disabled
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
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
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
              value={userData.address}
              onChange={(value) => setUserData({ ...userData, address: value })}
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
              value={userData.role}
              onChange={(value) =>
                setUserData({
                  ...userData,
                  role: value,
                  serviceIds: value === "staff" ? userData.serviceIds : [],
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
          {userData.role === "staff" && (
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
                value={userData.serviceIds}
                onChange={(value) =>
                  setUserData({ ...userData, serviceIds: value })
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
              value={userData.age}
              onChange={(e) =>
                setUserData({ ...userData, age: e.target.value })
              }
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
              value={userData.discountPercentage}
              onChange={(e) =>
                setUserData({
                  ...userData,
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
