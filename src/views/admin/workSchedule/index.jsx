import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Divider,
} from "antd";
import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import { LoadingOutlined } from "@ant-design/icons";
import Card from "components/card/Card";
import {
  getWorkScheduleByUserId,
  createWorkSchedule,
  updateWorkSchedule,
} from "services/workScheduleService";
import moment from "moment";

const { Title, Text } = Typography;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const weekDays = [
  { day: "Thứ Hai", startTime: "", endTime: "" },
  { day: "Thứ Ba", startTime: "", endTime: "" },
  { day: "Thứ Tư", startTime: "", endTime: "" },
  { day: "Thứ Năm", startTime: "", endTime: "" },
  { day: "Thứ Sáu", startTime: "", endTime: "" },
  { day: "Thứ Bảy", startTime: "", endTime: "" },
  { day: "Chủ Nhật", startTime: "", endTime: "" },
];

export default function WorkSchedule() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(weekDays);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchWorkSchedule();
  }, []);

  const fetchWorkSchedule = async () => {
    setLoading(true);
    try {
      const response = await getWorkScheduleByUserId(user?.user?._id);
      const fetchedDays = response.payload.days;

      const completeDays = weekDays.map((weekDay) => {
        const matchedDay = fetchedDays.find((day) => day.day === weekDay.day);
        return matchedDay ? matchedDay : weekDay;
      });

      setSchedule(response.payload);
      setDays(completeDays);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      if (schedule) {
        await updateWorkSchedule(user?.user?._id, { days });
        message.success("Cập nhật lịch làm việc thành công");
      } else {
        await createWorkSchedule({ userId: user.user._id, days });
        message.success("Tạo lịch làm việc thành công");
      }
      fetchWorkSchedule();
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
        w="90%"
        maxW="600px"
        px="25px"
        py="30px"
        borderRadius="12px"
        boxShadow="lg"
      >
        <Center>
          <Title level={3} style={{ marginBottom: "20px", color: "#FF8000" }}>
            Quản lý Lịch làm việc
          </Title>
        </Center>
        <Divider style={{ marginBottom: "20px" }} />
        {loading ? (
          <Spin indicator={loadingIcon} />
        ) : (
          <Box>
            {days.map((day, index) => (
              <Row
                key={index}
                gutter={[16, 16]}
                align="middle"
                style={{
                  marginBottom: "12px",
                  padding: "10px 0",
                  borderRadius: "8px",
                }}
              >
                <Col span={6}>
                  <Text
                    strong
                    style={{
                      color: "#FF8000",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {day.day}
                  </Text>
                </Col>
                <Col span={8}>
                  <Input
                    placeholder="Giờ bắt đầu (HH:mm)"
                    value={day.startTime}
                    onChange={(e) =>
                      handleChangeTime(index, "startTime", e.target.value)
                    }
                    pattern="[0-1][0-9]:[0-5][0-9]|2[0-3]:[0-5][0-9]"
                    style={{
                      textAlign: "center",
                      borderRadius: "8px",
                      borderColor: "#FF8000",
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Input
                    placeholder="Giờ kết thúc (HH:mm)"
                    value={day.endTime}
                    onChange={(e) =>
                      handleChangeTime(index, "endTime", e.target.value)
                    }
                    pattern="[0-1][0-9]:[0-5][0-9]|2[0-3]:[0-5][0-9]"
                    style={{
                      textAlign: "center",
                      borderRadius: "8px",
                      borderColor: "#FF8000",
                    }}
                  />
                </Col>
              </Row>
            ))}
            <Divider style={{ margin: "20px 0" }} />
            <Flex justify="center">
              <Button
                type="primary"
                onClick={handleSaveSchedule}
                size="large"
                style={{
                  borderRadius: "8px",
                  padding: "0 40px",
                  fontWeight: "bold",
                  backgroundColor: "#FF8000",
                  color: "white",
                }}
              >
                {schedule ? "Cập nhật lịch" : "Tạo lịch"}
              </Button>
            </Flex>
          </Box>
        )}
      </Card>
    </Box>
  );
}
