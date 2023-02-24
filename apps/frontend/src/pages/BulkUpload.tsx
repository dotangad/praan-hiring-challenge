import React from "react";
import {
  Flex,
  Box,
  Text,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { tokenAtom, useProtected } from "../lib/auth";
import { API_BASE_URL } from "../lib/api";

type Inputs = {
  file: FileList;
};

function BulkUpload() {
  useProtected();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [token, setToken] = useAtom(tokenAtom);

  const uploadMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const formData = new FormData();
      formData.append("raw_data", data.file[0]);

      const res = await fetch(`${API_BASE_URL}/api/bulk_upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return {
        ...(await res.json()),
        status: res.status,
      };
    },
    onSuccess: () => reset(),
    onError: console.log,
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => uploadMutation.mutate(data);

  return (
    <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
      <Box
        w="xl"
        bg="white"
        shadow="xl"
        rounded="2xl"
        p={10}
        position="relative"
        overflow="hidden"
        _dark={{ bg: "gray.700" }}
      >
        {uploadMutation.isLoading && (
          <>
            {/* Overlay */}
            <Box
              zIndex="200"
              w="100%"
              h="100%"
              bg="gray.600"
              opacity="0.8"
              position="absolute"
              top="0"
              left="0"
            />
            {/* Spinner and text */}
            <Flex
              zIndex="300"
              w="100%"
              h="100%"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
              position="absolute"
              top="0"
              left="0"
              color="white"
            >
              <Spinner thickness="5px" speed="2s" color="white" size="xl" />
              <Text mt={6} fontSize="lg" fontWeight="semibold">
                This might take a while. Go grab a cup of coffee!
              </Text>
            </Flex>
          </>
        )}

        <Box zIndex="100">
          <Text
            fontSize="2xl"
            fontWeight="extrabold"
            letterSpacing="widest"
            casing="uppercase"
            color="gray.400"
            textAlign="center"
            my={5}
          >
            Bulk Upload CSV
          </Text>

          <Text
            color="gray.600"
            textAlign="center"
            my={5}
            mb={10}
            _dark={{ color: "gray.400" }}
          >
            Upload a CSV file (Excel export) which looks like{" "}
            <Link
              href="https://pastebin.com/raw/rkz8acfx"
              target="_blank"
              color="teal.500"
            >
              this example
            </Link>
            . Ensure that the headers and date format match the example.
          </Text>

          <Flex
            onSubmit={handleSubmit(onSubmit)}
            as="form"
            flexDir="column"
            rowGap={8}
            w="100%"
            my={5}
          >
            <Input
              type="file"
              required
              accept=".csv,text/csv"
              {...register("file", { required: true })}
            />

            {uploadMutation.data &&
              (uploadMutation.data?.success === true ? (
                <Alert status="success">
                  <AlertIcon />
                  {uploadMutation.data?.message}
                </Alert>
              ) : (
                <Alert status="error">
                  <AlertIcon />
                  {uploadMutation.data?.message}
                </Alert>
              ))}

            <Box>
              <Button
                type="submit"
                w="100%"
                isDisabled={uploadMutation.isLoading}
              >
                Upload
              </Button>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

export default BulkUpload;
