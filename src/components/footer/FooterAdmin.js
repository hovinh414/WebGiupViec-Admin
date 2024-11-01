/*eslint-disable*/
import React from "react";
import { Flex } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      zIndex="3"
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent="space-between"
      px={{ base: "30px", md: "50px" }}
      pb="30px"
    ></Flex>
  );
}
