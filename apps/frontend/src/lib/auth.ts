import { atomWithStorage } from "jotai/utils";
import { API_BASE_URL } from "./api";

export const tokenAtom = atomWithStorage("token", false);

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
