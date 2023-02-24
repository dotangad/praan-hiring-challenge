import React from "react";
import {
  Flex,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "../lib/api";

type Inputs = {
  email: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit } = useForm<Inputs>();

  const registerMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) =>
    registerMutation.mutate(data);

  return (
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
          Register
        </Text>

        <Flex
          onSubmit={handleSubmit(onSubmit)}
          as="form"
          flexDir="column"
          rowGap={8}
          w="100%"
          my={5}
        >
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="rahul@example.com"
              {...register("email")}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="p4ssw0rd!"
              {...register("password")}
              required
            />
          </FormControl>

          {registerMutation.data &&
            (registerMutation.data?.success === true ? (
              <Alert status="success">
                <AlertIcon />
                {registerMutation.data?.message}
              </Alert>
            ) : (
              <Alert status="error">
                <AlertIcon />
                {registerMutation.data?.message}
              </Alert>
            ))}

          <Box>
            <Button
              type="submit"
              w="100%"
              isLoading={registerMutation.isLoading}
              isDisabled={registerMutation.isLoading}
            >
              Register
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
