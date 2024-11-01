import React from "react";
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align="center" direction="column">
      <Text
        fontSize="2xl" // Set size
        fontWeight="bold"
        color={logoColor} // Use color mode for text color
        my="32px"
      >
        We Shine
      </Text>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
