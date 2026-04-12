import { useApiClient } from "@/utils/apiClient";

const baseURL = "/orders";

export function getOrdersByEvent(eventId) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/event/${eventId}`;
  return apiClient.get(customURL);
}

// Valida i reserva places per a un event concret
export function validateReserveOrder(eventId, payload) {
  const apiClient = useApiClient();
  const customURL = `/events/${eventId}/orders/validate-reserve`;
  console.log("[FLOW][front] validateReserveOrder → URL & payload", {
    url: customURL,
    payload,
  });

  return apiClient.post(customURL, payload);
}
