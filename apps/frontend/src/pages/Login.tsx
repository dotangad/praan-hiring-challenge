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
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { tokenAtom, useGuest } from "../lib/auth";
import { API_BASE_URL } from "../lib/api";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  useGuest();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [token, setToken] = useAtom(tokenAtom);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return {
        ...(await res.json()),
        status: res.status,
      };
    },
    onSuccess: ({ success, status, token: tokenStr }) => {
      if (success && status === 200) {
        setToken(tokenStr);
        navigate("/");
      }
    },
    onError: console.log,
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => loginMutation.mutate(data);

  return (
    <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
      <Box w="xl" bg="white" shadow="xl" rounded="2xl" p={10}>
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
          Login
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

          {loginMutation.data &&
            (loginMutation.data?.success === true ? (
              <Alert status="success">
                <AlertIcon />
                Logged in
              </Alert>
            ) : (
              <Alert status="error">
                <AlertIcon />
                {loginMutation.data?.message}
              </Alert>
            ))}

          <Box>
            <Button
              type="submit"
              w="100%"
              isLoading={loginMutation.isLoading}
              isDisabled={loginMutation.isLoading}
            >
              Login
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
