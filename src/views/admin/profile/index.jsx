import React, { useState, useEffect } from "react";
import { Tabs, Input, Button, Avatar, Row, Col, Spin, message } from "antd";
import { Box } from "@chakra-ui/react";
import {
  updateUserProfile,
  changePassword,
  getUserByid,
} from "services/userService";
import { LoadingOutlined } from "@ant-design/icons";
import Card from "components/card/Card";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    active: false,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?._id;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        if (userId) {
          const userData = await getUserByid(userId);
          setUser(userData);
          setAvatarPreview(userData.avatar);
        } else {
          message.error("Không tìm thấy ID người dùng trong localStorage");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error("Tải dữ liệu người dùng thất bại");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const validateProfileForm = () => {
    if (!user.name) {
      message.warning("Vui lòng nhập họ tên");
      return false;
    }
    if (!user.email) {
      message.warning("Vui lòng nhập email");
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      message.warning("Địa chỉ email không hợp lệ");
      return false;
    }
    if (!user.phone) {
      message.warning("Vui lòng nhập số điện thoại");
      return false;
    }
    return true;
  };

  const validateChangePasswordForm = () => {
    if (!passwords.currentPassword) {
      message.warning("Vui lòng nhập mật khẩu hiện tại");
      return false;
    }
    if (!passwords.newPassword) {
      message.warning("Vui lòng nhập mật khẩu mới");
      return false;
    }
    if (passwords.newPassword.length < 6) {
      message.warning("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (passwords.confirmNewPassword !== passwords.newPassword) {
      message.warning("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return;

    try {
      setLoading(true);
      await updateUserProfile(user._id, user);
      message.success("Cập nhật hồ sơ thành công");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.message || "Cập nhật hồ sơ thất bại");
    }
  };

  const handleChangePassword = async () => {
    if (!validateChangePasswordForm()) return;

    try {
      setPasswordLoading(true);
      await changePassword(userId, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      message.success("Đổi mật khẩu thành công");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordLoading(false);
    } catch (error) {
      setPasswordLoading(false);
      message.error(error.response.data.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100%"
      minH="100vh"
    >
      <Card
        direction="column"
        w="80%"
        maxW="600px"
        px="25px"
        py="20px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Tabs
          defaultActiveKey="1"
          centered
          tabBarStyle={{
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <Tabs.TabPane tab="Hồ Sơ" key="1">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Avatar
                size={120}
                src={
                  avatarPreview ||
                  "https://i.pinimg.com/originals/94/e4/cb/94e4cb5ae194975f6dc84d1495c3abcd.gif"
                }
              />
              <h2 style={{ fontWeight: "bold", fontSize: "22px" }}>
                {user.name}
              </h2>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "bold" }}>Email</label>
              <Input
                allowClear
                disabled
                name="email"
                value={user.email}
                onChange={handleInputChange}
                style={{ height: "40px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "bold" }}>Số điện thoại</label>
              <Input
                allowClear
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                style={{ height: "40px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "bold" }}>Địa chỉ</label>
              <Input
                allowClear
                name="address"
                value={user.address}
                onChange={handleInputChange}
                style={{ height: "40px" }}
              />
            </div>

            <Button
              type="primary"
              onClick={handleUpdateProfile}
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: "#FF8000",
                borderColor: "#FF8000",
                color: "white",
              }}
            >
              {loading ? <Spin indicator={loadingIcon} /> : "Lưu thay đổi"}
            </Button>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đổi Mật Khẩu" key="2">
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "bold" }}>Mật khẩu hiện tại</label>
              <Input.Password
                allowClear
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                style={{ height: "40px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "bold" }}>Mật khẩu mới</label>
              <Input.Password
                allowClear
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                style={{ height: "40px" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontWeight: "bold" }}>
                Xác nhận mật khẩu mới
              </label>
              <Input.Password
                allowClear
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                style={{ height: "40px" }}
              />
            </div>

            <Button
              type="primary"
              onClick={handleChangePassword}
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: "#FF8000",
                borderColor: "#FF8000",
                color: "white",
              }}
            >
              {passwordLoading ? (
                <Spin indicator={loadingIcon} />
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Box>
  );
}
