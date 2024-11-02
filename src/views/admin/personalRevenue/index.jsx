import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import MiniStatisticsPersional from "components/card/MiniStatisticsPersional";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DatePicker } from "antd";
import IconBox from "components/icons/IconBox";
import React, { useEffect, useState } from "react";
import { MdAttachMoney } from "react-icons/md";
import { getRevenue } from "services/personalRevenueService";
import { formatCurrency } from "utils/formatCurrency";
import Card from "components/card/Card";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function UserReports() {
  const [statistics, setStatistics] = useState({
    revenueToday: 0,
    revenueThisMonth: 0,
    revenueThisYear: 0,
    revenueYesterday: 0,
    revenueLastMonth: 0,
    revenueLastYear: 0,
    todayGrowth: null,
    monthGrowth: null,
    yearGrowth: null,
    beforeDiscountToday: 0,
    beforeDiscountMonth: 0,
    beforeDiscountYear: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const [statisticsTime, setStatisticsTime] = useState({ revenue: [] });

  // Ngày mặc định cho range picker
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "day"),
    dayjs().add(1, "day"),
  ]);

  const fetchRevenueStatistics = async () => {
    const startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
    const endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");

    try {
      const data = await getRevenue(user?.user?._id, startDate, endDate);
      setStatistics({
        revenueToday: data.revenueToday,
        revenueYesterday: data.revenueYesterday,
        todayGrowth: data.todayGrowth,
        revenueThisMonth: data.revenueThisMonth,
        revenueLastMonth: data.revenueLastMonth,
        monthGrowth: data.monthGrowth,
        revenueThisYear: data.revenueThisYear,
        revenueLastYear: data.revenueLastYear,
        yearGrowth: data.yearGrowth,
        beforeDiscountToday: data.beforeDiscountToday,
        beforeDiscountMonth: data.beforeDiscountMonth,
        beforeDiscountYear: data.beforeDiscountYear,
      });

      const sortedRevenue = data.customRevenue.sort(
        (a, b) => new Date(a._id) - new Date(b._id)
      );
      setStatisticsTime({ revenue: sortedRevenue });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    }
  };

  useEffect(() => {
    fetchRevenueStatistics();
  }, []);

  const handleDateChange = (dates) => {
    setDateRange(dates || [dayjs().subtract(1, "day"), dayjs().add(1, "day")]);
  };

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatisticsPersional
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Doanh thu hôm nay"
          value={formatCurrency(statistics.revenueToday, "VND")}
          discount={formatCurrency(
            statistics.beforeDiscountToday - statistics.revenueToday,
            "VND"
          )}
          growth={statistics.todayGrowth?.toFixed(2) || 0}
          content="so với hôm qua"
        />
        <MiniStatisticsPersional
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Doanh thu tháng này"
          value={formatCurrency(statistics.revenueThisMonth, "VND")}
          discount={formatCurrency(
            statistics.beforeDiscountMonth - statistics.revenueThisMonth,
            "VND"
          )}
          growth={statistics.monthGrowth?.toFixed(2) || 0}
          content="so với tháng trước"
        />
        <MiniStatisticsPersional
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Doanh thu năm nay"
          value={formatCurrency(statistics.revenueThisYear, "VND")}
          discount={formatCurrency(
            statistics.beforeDiscountYear - statistics.revenueThisYear,
            "VND"
          )}
          growth={statistics.yearGrowth?.toFixed(2) || 0}
          content="so với năm trước"
        />
      </SimpleGrid>

      <Card
        direction="column"
        w="100%"
        px="25px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        mb="20px"
      >
        <Flex justify="space-between" align="center" mb="20px">
          <RangePicker
            onChange={handleDateChange}
            value={dateRange}
            style={{ marginRight: "20px" }}
          />
          <Button colorScheme="brand" onClick={fetchRevenueStatistics}>
            Tính toán
          </Button>
        </Flex>
      </Card>

      <Card
        direction="column"
        w="100%"
        px="25px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Text
          lineHeight="100%"
          fontSize={{ base: "xl" }}
          fontWeight="bold"
          mb={5}
        >
          Doanh thu theo thời gian
        </Text>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={statisticsTime?.revenue || []}
            margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => `Ngày: ${label}`}
              formatter={(value) => `${formatCurrency(value, "VND")}`}
            />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              name="Doanh thu"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}
