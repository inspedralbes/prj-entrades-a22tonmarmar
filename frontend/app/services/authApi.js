import { useApiClient } from "~/utils/apiClient";

export function useAuthApi() {
  const api = useApiClient();

  async function login(credentials) {
    const response = await api.post("/login", credentials);
    return response;
  }

  async function logout() {
    const response = await api.post("/logout");
    return response;
  }

  return {
    login,
    logout,
  };
}
