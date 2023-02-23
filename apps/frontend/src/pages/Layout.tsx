import React from "react";
import { Flex, Box, Text, Image, Button, Link, Icon } from "@chakra-ui/react";
import { useLocation, Outlet, Link as RouterLink } from "react-router-dom";
import { AiOutlineLogin, AiOutlineUser } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { meFetcher, tokenAtom } from "../lib/auth";

export default function Layout() {
  const location = useLocation();
  const [token] = useAtom(tokenAtom);
  const meQuery = useQuery(["api.auth.me"], meFetcher({ token }));

  const links = [
    {
      label: "Login",
      path: "/login",
      icon: AiOutlineLogin,
    },
    {
      label: "Register",
      path: "/register",
      icon: AiOutlineUser,
    },
  ];

  return (
    <Flex w="100vw" h="100vh" overflow="hidden" bg="gray.50">
      <Flex w="500px" h="100%" overflow="hidden" p={10}>
        <Flex
          bg="white"
          rounded="2xl"
          shadow="xl"
          p={5}
          w="100%"
          flexDir="column"
        >
          <Text
            fontSize="2xl"
            fontWeight="extrabold"
            letterSpacing="widest"
            casing="uppercase"
            color="gray.400"
            textAlign="center"
            my={5}
          >
            Dashboard
          </Text>
          <Box flex={1}>
            {/* <pre>{JSON.stringify(meQuery.data, null, 2)}</pre> */}

            {links.map(({ label, path, icon }, i) => (
              <Link
                key={i}
                as={RouterLink}
                to={path}
                _hover={{ textDecoration: "none" }}
              >
                <Flex
                  alignItems="center"
                  columnGap={4}
                  px={5}
                  py={3}
                  bg={location.pathname === path ? "gray.100" : "white"}
                  rounded="md"
                >
                  <Icon as={icon} boxSize={6} color="gray.500" />
                  <Text color="gray.600" fontSize="xl" fontWeight="semibold">
                    {label}
                  </Text>
                </Flex>
              </Link>
            ))}
          </Box>
          <Flex my={5} mx={5} columnGap={5} alignItems="center">
            <Image src="/pfp.jpg" boxSize={16} rounded="full" />
            <Box>
              {meQuery.data?.user ? (
                <>
                  <Text>{meQuery.data?.user.email}</Text>
                  <Box>
                    {/* TODO: make this work */}
                    <Button
                      mt={2}
                      size="xs"
                      textTransform="uppercase"
                      fontWeight="bold"
                      letterSpacing="wide"
                    >
                      Logout
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Text>Not Logged in</Text>
                </>
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Box flex={1} h="100%" overflowY="auto">
        <Box w="100%" h="100%" p={10}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
