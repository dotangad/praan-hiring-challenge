import { useRouteError } from "react-router-dom";
import { Flex, Box, Text } from "@chakra-ui/react";
import Layout from "./Layout";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Layout>
      {/* <Box>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          {/* @ts-ignore 
          <i>{error.statusText || error.message}</i>
        </p>
      </Box> */}

      <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
        <Box
          w="xl"
          bg="white"
          shadow="xl"
          rounded="2xl"
          p={10}
          _dark={{ bg: "gray.700" }}
        >
          <Text
            fontSize="2xl"
            fontWeight="extrabold"
            letterSpacing="widest"
            casing="uppercase"
            color="gray.400"
            textAlign="center"
            my={5}
            mb={10}
          >
            Oops!
          </Text>
          <Text
            color="gray.600"
            textAlign="center"
            my={5}
            mb={10}
            _dark={{ color: "gray.400" }}
          >
            {/* @ts-ignore */}
            {error.statusText || error.message}
          </Text>
        </Box>
      </Flex>
    </Layout>
  );
}
