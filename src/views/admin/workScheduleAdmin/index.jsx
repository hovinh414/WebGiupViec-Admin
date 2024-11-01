import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  CircularProgress,
  Text,
  Button as ChakraButton,
} from "@chakra-ui/react";
import { Table, message, Tag, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment"; // Import moment here
import {
  getAllWorkSchedule,
  getWorkScheduleByUserId,
  updateWorkSchedule,
  createWorkSchedule,
} from "services/workScheduleService";
import Card from "components/card/Card";

const daysOfWeek = [
  { day: "Thứ Hai", color: "blue" },
  { day: "Thứ Ba", color: "green" },
  { day: "Thứ Tư", color: "purple" },
  { day: "Thứ Năm", color: "orange" },
  { day: "Thứ Sáu", color: "red" },
  { day: "Thứ Bảy", color: "cyan" },
  { day: "Chủ Nhật", color: "magenta" },
];

export default function WorkScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [days, setDays] = useState(
    daysOfWeek.map((d) => ({ ...d, startTime: "", endTime: "" }))
  );

  useEffect(() => {
    fetchWorkSchedules();
  }, []);

  const fetchWorkSchedules = async () => {
    setLoading(true);
    try {
      const data = await getAllWorkSchedule();
      setSchedules(data);
    } catch (error) {
      message.error("Không thể tải danh sách lịch làm việc.");
      console.error("Error fetching work schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSchedule = async (userId) => {
    try {
      const response = await getWorkScheduleByUserId(userId);
      const fetchedDays = response.payload.days;

      const completeDays = daysOfWeek.map((weekDay) => {
        const matchedDay = fetchedDays.find((day) => day.day === weekDay.day);
        return matchedDay ? { ...weekDay, ...matchedDay } : weekDay;
      });

      setDays(completeDays);
    } catch (error) {
      console.error("Error fetching user schedule:", error);
    }
  };

  const renderScheduleForDay = (days, dayOfWeek, color) => {
    const daySchedule = days.find((d) => d.day === dayOfWeek);

    if (!daySchedule) {
      // Khi không có `daySchedule`, hiển thị nút thêm lịch
      return (
        <ChakraButton
          leftIcon={<PlusOutlined />}
          variant="ghost"
          size="sm"
          onClick={() => message.info("Add schedule functionality")}
        >
          +
        </ChakraButton>
      );
    } else if (!daySchedule.startTime || !daySchedule.endTime) {
      // Khi `daySchedule` tồn tại nhưng không có `startTime` hoặc `endTime`
      return (
        <Tag color="default" style={{ fontSize: "14px", padding: "5px 10px" }}>
          Chưa có lịch làm
        </Tag>
      );
    } else {
      // Khi có đầy đủ `startTime` và `endTime`, hiển thị thời gian làm việc
      return (
        <Tag color={color} style={{ fontSize: "14px", padding: "5px 10px" }}>
          {daySchedule.startTime} - {daySchedule.endTime}
        </Tag>
      );
    }
  };

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "userId",
      key: "userId",
      render: (user) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={
              user.avatar ||
              "https://i.pinimg.com/originals/94/e4/cb/94e4cb5ae194975f6dc84d1495c3abcd.gif"
            }
            alt={user.name}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              marginRight: "15px",
            }}
          />
          <div>
            <Text fontWeight="bold" fontSize="16px">
              {user.name}
            </Text>
            <Text fontSize="14px" color="gray.500">
              {user.role}
            </Text>
            <Text fontSize="14px" color="gray.500">
              {user.email}
            </Text>
            <Text fontSize="14px" color="gray.500">
              {user.phone}
            </Text>
            <Text fontSize="14px" color="gray.500">
              {user.address}
            </Text>
          </div>
        </div>
      ),
    },
    ...daysOfWeek.map(({ day, color }) => ({
      title: day,
      key: day,
      align: "center",
      render: (_, record) => renderScheduleForDay(record.days, day, color),
    })),
  ];

  const handleRowClick = (record) => {
    setSelectedUser(record.userId);
    fetchUserSchedule(record.userId._id);
    setModalVisible(true);
  };

  const handleSaveSchedule = async () => {
    const isValid = days.every((day) => {
      if (day.startTime && day.endTime) {
        const start = moment(day.startTime, "HH:mm");
        const end = moment(day.endTime, "HH:mm");
        return start.isBefore(end);
      }
      return true;
    });

    if (!isValid) {
      message.error(
        "Giờ bắt đầu phải nhỏ hơn giờ kết thúc cho tất cả các ngày."
      );
      return;
    }

    setLoading(true);
    try {
      await updateWorkSchedule(selectedUser._id, { days });
      message.success("Cập nhật lịch làm việc thành công");
      fetchWorkSchedules(); // Refresh the list after update or create
      setModalVisible(false); // Close modal after success
    } catch (error) {
      message.error("Không thể lưu lịch làm việc");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTime = (dayIndex, field, value) => {
    const updatedDays = days.map((d, index) =>
      index === dayIndex ? { ...d, [field]: value } : d
    );
    setDays(updatedDays);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} w="100%">
      <Card direction="column" w="100%" px="25px">
        <Flex justify="space-between" mb="15px" align="center">
          <Text fontSize="24px" fontWeight="700">
            Quản Lý Lịch Làm Việc
          </Text>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <Table
            columns={columns}
            dataSource={schedules}
            rowKey={(record) => record._id}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            pagination={{ pageSize: 5 }}
          />
        )}
      </Card>

      <Modal
        title={`Lịch làm việc của ${selectedUser?.name}`}
        visible={modalVisible}
        onOk={handleSaveSchedule}
        onCancel={() => setModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: {
            backgroundColor: "#FF8000",
            borderColor: "#FF8000",
            color: "white",
          },
        }}
      >
        {days.map((day, index) => (
          <Row
            key={day.day}
            gutter={[16, 16]}
            align="middle"
            style={{ marginBottom: "15px" }}
          >
            <Col span={6}>
              <Text strong>{day.day}</Text>
            </Col>
            <Col span={8}>
              <Input
                placeholder="Giờ bắt đầu (HH:mm)"
                value={day.startTime}
                onChange={(e) =>
                  handleChangeTime(index, "startTime", e.target.value)
                }
              />
            </Col>
            <Col span={8}>
              <Input
                placeholder="Giờ kết thúc (HH:mm)"
                value={day.endTime}
                onChange={(e) =>
                  handleChangeTime(index, "endTime", e.target.value)
                }
              />
            </Col>
          </Row>
        ))}
      </Modal>
    </Box>
  );
}
