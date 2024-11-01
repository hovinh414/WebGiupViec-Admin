// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Custom icons
import React from "react";

export default function Default(props) {
  const {
    startContent,
    endContent,
    name,
    growth,
    value,
    content,
    discountToday,
    discountThisMonth,
    discountThisYear,
  } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Card py="15px">
      <Flex
        my="auto"
        h="100%"
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}
      >
        {startContent}

        <Stat my="auto" ms={startContent ? "18px" : "0px"}>
          <StatLabel
            lineHeight="100%"
            color={textColor}
            fontSize={{
              base: "xl",
            }}
          >
            {name}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize={{
              base: "2xl",
            }}
          >
            {value}
          </StatNumber>

          {/* Hiển thị tăng trưởng và nội dung */}
          {growth !== undefined && (
            <Flex align="center">
              <Text
                color={growth >= 0 ? "green.500" : "red.500"}
                fontSize="md"
                fontWeight="700"
                me="5px"
              >
                {growth > 0 ? `+${growth}%` : `${growth}%`}
              </Text>
              <Text color={textColor} fontSize="md" fontWeight="400">
                {content}
              </Text>
            </Flex>
          )}

          {/* Hiển thị thông tin chiết khấu */}
          {discountToday !== undefined && (
            <Text color="gray.500" fontSize="md" fontWeight="500" mt="4px">
              Chiết khấu hôm nay: + {discountToday}
            </Text>
          )}
          {discountThisMonth !== undefined && (
            <Text color="gray.500" fontSize="md" fontWeight="500" mt="4px">
              Chiết khấu tháng này: + {discountThisMonth}
            </Text>
          )}
          {discountThisYear !== undefined && (
            <Text color="gray.500" fontSize="md" fontWeight="500" mt="4px">
              Chiết khấu năm nay: + {discountThisYear}
            </Text>
          )}
        </Stat>

        <Flex ms="auto" w="max-content">
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
