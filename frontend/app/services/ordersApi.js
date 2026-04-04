import { useApiClient } from "@/utils/apiClient";

const baseURL = "/orders";

export function getOrdersByEvent(eventId) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/event/${eventId}`;
  return apiClient.get(customURL);
}
