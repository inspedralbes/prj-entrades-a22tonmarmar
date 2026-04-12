import { useApiClient } from "@/utils/apiClient";

const baseURL = "/orders";

export function getOrdersByEvent(eventId) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/event/${eventId}`;
  return apiClient.get(customURL);
}

// Valida i reserva places per a un event concret (flux antic)
export function validateReserveOrder(eventId, payload) {
  const apiClient = useApiClient();
  const customURL = `/events/${eventId}/orders/validate-reserve`;
  console.log("[FLOW][front] validateReserveOrder → URL & payload", {
    url: customURL,
    payload,
  });

  return apiClient.post(customURL, payload);
}

// Nou flux: inicia el checkout, reserva places i crea una comanda en tràmit
export function startCheckout(eventId, payload) {
  const apiClient = useApiClient();
  const customURL = `/events/${eventId}/orders/start-checkout`;
  console.log("[FLOW][front] startCheckout \/ URL & payload", {
    url: customURL,
    payload,
  });

  return apiClient.post(customURL, payload);
}

// Confirma una comanda existent amb dades de client
export function confirmOrder(orderId, payload) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/${orderId}/confirm`;
  console.log("[FLOW][front] confirmOrder \/ URL & payload", {
    url: customURL,
    payload,
  });

  return apiClient.post(customURL, payload);
}

// Cancel·la una comanda en tràmit
export function cancelOrder(orderId) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/${orderId}/cancel`;
  console.log("[FLOW][front] cancelOrder \/ URL", { url: customURL });

  return apiClient.post(customURL);
}
