import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "./api";

const tokenAtomInit = atom(localStorage.getItem("token") ?? "");

export const tokenAtom = atom(
  (get) => get(tokenAtomInit),
  (get, set, newStr) => {
    set(tokenAtomInit, newStr as string);
    localStorage.setItem("token", newStr as string);
  }
);

export const useProtected = () => {
  const navigate = useNavigate();
  const [token] = useAtom(tokenAtom);
  const meQuery = useQuery(["api.auth.me"], meFetcher({ token }));

  useEffect(() => {
    if (!meQuery.data) return;
    if (!meQuery.data?.success) {
      navigate("/login");
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
