import { useApiClient } from "@/utils/apiClient";

const baseURL = "/events";

export function getEvents() {
  const apiClient = useApiClient();
  return apiClient.get(baseURL);
}

export function getEventById(idEvent) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.get(customURL);
}

export function createEvent(newEvent) {
  const apiClient = useApiClient();
  return apiClient.post(baseURL, newEvent);
}

export function updateEvent(idEvent, updatingData) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.patch(customURL, updatingData);
}

export function deleteEvent(idEvent) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.delete(customURL);
}