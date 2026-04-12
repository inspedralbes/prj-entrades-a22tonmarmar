function regularApiError(error) {
  const status = error?.response?.status ?? null;
  const data = error?.response?._data ?? null;

  return {
    status,
    message:
      data?.message ||
      error?.message ||
      "Error inesperat al communicar amb l'API",
    details: data?.errors || data || null,
    code: data?.code || null,
  };
}

function getToken() {
  if (!import.meta.client) return null;
  return localStorage.getItem("token");
}

export function useApiClient() {
  const config = useRuntimeConfig();

  // En SSR (dins Docker) usem la base interna; en client, la pública
  const baseURL = import.meta.server
    ? config.apiBase
    : config.public.apiBaseBrowser;

  const client = $fetch.create({
    baseURL,
    timeout: 30000,
    headers: {
      Accept: "application/json",
    },
    onRequest({ options }) {
      const token = getToken();
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    },
    onResponseError({ error }) {
      throw regularApiError(error);
    },
  });

  return {
    get: (url, options = {}) => client(url, { ...options, method: "GET" }),
    post: (url, body, options = {}) =>
      client(url, { ...options, method: "POST", body }),
    patch: (url, body, options = {}) =>
      client(url, { ...options, method: "PATCH", body }),
    delete: (url, options = {}) =>
      client(url, { ...options, method: "DELETE" }),
  };
}
