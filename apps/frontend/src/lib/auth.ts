import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "./api";

export const tokenAtom = atomWithStorage("token", false);

export const useProtected = () => {
  const navigate = useNavigate();
  const [token] = useAtom(tokenAtom);
  const meQuery = useQuery(["api.auth.me"], meFetcher({ token }));

  useEffect(() => {
    if ((meQuery.data && !meQuery.data?.success) || !token) {
      navigate("/login");
    }
  }, [meQuery.data, token]);
};

export const useGuest = () => {
  const navigate = useNavigate();
  const [token] = useAtom(tokenAtom);
  const meQuery = useQuery(["api.auth.me"], meFetcher({ token }));

  useEffect(() => {
    if (typeof token === "string" && meQuery.data && meQuery.data?.success) {
      navigate("/");
    }
  }, [meQuery.data]);
};

export const meFetcher =
  ({ token }: { token: string | boolean | undefined }) =>
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (response.status === 401) {
      return {
        success: false,
      };
    }

    return response.json();
  };
