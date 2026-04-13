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

  async function request(
    url,
    { method = "GET", body, headers = {}, ...rest } = {},
  ) {
    const token = getToken();
    const finalHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    };
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }

    const fetchOptions = {
      method,
      headers: finalHeaders,
      ...rest,
    };
    if (body !== undefined) {
      if (body instanceof FormData) {
        fetchOptions.body = body;
        delete finalHeaders["Content-Type"];
      } else {
        fetchOptions.body =
          typeof body === "string" ? body : JSON.stringify(body);
      }
    }

    let response;
    try {
      response = await fetch(baseURL + "/api" + url, fetchOptions);
    } catch (error) {
      throw regularApiError(error);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      throw regularApiError({
        response: { status: response.status, _data: data },
      });
    }
    return data;
  }

  return {
    get: (url, options = {}) => request(url, { ...options, method: "GET" }),
    post: (url, body, options = {}) =>
      request(url, { ...options, method: "POST", body }),
    patch: (url, body, options = {}) =>
      request(url, { ...options, method: "PATCH", body }),
    delete: (url, options = {}) =>
      request(url, { ...options, method: "DELETE" }),
  };
}
