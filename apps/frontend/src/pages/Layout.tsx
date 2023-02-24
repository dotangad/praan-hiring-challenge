import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import {
  AiOutlineHome,
  AiOutlineLineChart,
  AiOutlineLogin,
  AiOutlineUpload,
  AiOutlineUser,
} from "react-icons/ai";
import { TbSun, TbMoon } from "react-icons/tb";
import { BsWind } from "react-icons/bs";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { meFetcher, tokenAtom } from "../lib/auth";

export default function Layout() {
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const [token, setToken] = useAtom(tokenAtom);
  const meQuery = useQuery(["api.auth.me"], meFetcher({ token }), {
    enabled: !!token,
  });

  const links = [
    {
      label: "Login",
      path: "/login",
      icon: AiOutlineLogin,
      showIf: token === false,
    },
    {
      label: "Register",
      path: "/register",
      icon: AiOutlineUser,
      showIf: token === false,
    },
    {
      label: "Dashboard",
      path: "/",
      icon: AiOutlineHome,
      showIf: meQuery.data?.user,
    },
    {
      label: "Bulk Upload",
      path: "/upload",
      icon: AiOutlineUpload,
      showIf: meQuery.data?.user,
    },
    {
      label: "Comparison Graphs",
      path: "/charts/comparison",
      icon: AiOutlineLineChart,
      showIf: meQuery.data?.user,
    },
    {
      label: "Time-series Graphs",
      path: "/charts/timeseries",
      icon: AiOutlineLineChart,
      showIf: meQuery.data?.user,
    },
    {
      label: "Wind Data",
      path: "/charts/wind",
      icon: BsWind,
      showIf: meQuery.data?.user,
    },
  ];

  return (
    <Flex
      w="100vw"
      h="100vh"
      overflow="hidden"
      bg="gray.50"
      _dark={{ bg: "gray.800" }}
    >
      <Flex w="30vw" maxW="450px" h="100%" overflow="hidden" p={10}>
        <Flex
          bg="white"
          rounded="2xl"
          shadow="xl"
          p={5}
          w="100%"
          flexDir="column"
          alignItems="center"
          _dark={{
            bg: "gray.700",
          }}
        >
          <Image
            src={
              colorMode === "light"
                ? "https://praan.io/logos/praanwt.svg"
                : "/praan-white.svg"
            }
            my={5}
            w="50%"
            h="auto"
          />
          <Box flex={1} w="100%">
            {links
              .filter((x) => x.showIf)
              .map(({ label, path, icon }, i) => (
                <Link
                  key={i}
                  as={RouterLink}
                  to={path}
                  _hover={{ textDecoration: "none" }}
                >
                  <Flex
                    alignItems="center"
                    columnGap={4}
                    my={2}
                    px={5}
                    py={3}
                    bg={location.pathname === path ? "gray.100" : "white"}
                    rounded="md"
                    _hover={{ bg: "gray.50" }}
                    _dark={{
                      _hover: { bg: "gray.600" },
                      bg: location.pathname === path ? "gray.600" : "gray.700",
                    }}
                  >
                    <Icon
                      as={icon}
                      boxSize={6}
                      color="gray.500"
                      _dark={{ color: "gray.300" }}
                    />
                    <Text
                      color="gray.600"
                      fontSize="xl"
                      fontWeight="semibold"
                      _dark={{ color: "white" }}
                    >
                      {label}
                    </Text>
                  </Flex>
                </Link>
              ))}
          </Box>
          <Flex mt={5} mx={5} columnGap={5} alignItems="center" w="100%">
            <Image src="/pfp.jpg" boxSize={16} rounded="full" />

            <Box flex={1}>
              {meQuery.data?.user ? (
                <>
                  <Text>{meQuery.data?.user.email}</Text>
                  <Box>
                    <Button
                      mt={2}
                      size="xs"
                      textTransform="uppercase"
                      fontWeight="bold"
                      letterSpacing="wide"
                      onClick={() => {
                        setToken(false);
                        window.location.href = "/login";
                      }}
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

            <Box>
              {colorMode === "light" ? (
                <IconButton
                  aria-label="Theme"
                  icon={<TbMoon />}
                  onClick={() => toggleColorMode()}
                />
              ) : (
                <IconButton
                  aria-label="Theme"
                  icon={<TbSun />}
                  onClick={() => toggleColorMode()}
                />
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
