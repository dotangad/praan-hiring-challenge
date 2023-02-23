import React from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Flex w="100vw" h="100vh" overflow="hidden" bg="gray.100">
      <Flex w="500px" h="100%" overflow="hidden" p={10}>
        <Box bg="white" rounded="2xl" shadow="xl" p={3} w="100%">
          hello
        </Box>
      </Flex>
      <Box flex={1} h="100%" overflowY="auto">
        <Box w="100%" p={10}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
