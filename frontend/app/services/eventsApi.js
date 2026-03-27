import { useApiClient } from "@/utils/apiClient";

const apiClient = useApiClient();
const baseURL = "/events";

export function getEvents() {
  return apiClient.get(baseURL);
}

export function getEventById(idEvent) {
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.get(customURL);
}

export function createEvent(newEvent) {
  return apiClient.post(baseURL, newEvent);
}

export function updateEvent(idEvent, updatingData) {
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.patch(customURL, updatingData);
}

export function deleteEvent(idEvent) {
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.delete(customURL);
}
