import { useApiClient } from "~/app/utils/apiClient";

export function useAuthApi() {
  const api = useApiClient();

  async function login(credentials) {
    const response = await api.post("/login", credentials);
    return response;
  }

  // de moment no existeix el logout
  async function logout() {
    const response = await api.post("/logout");
    return Promise.resolve();
  }

  return {
    login,
    logout,
  };
}
