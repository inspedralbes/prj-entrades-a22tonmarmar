import { useApiClient } from "@/utils/apiClient";

const apiClient = useApiClient();
const baseURL = "/tiquets";

export function getTiquetById(idEvent) {
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.get(customURL);
}

export function updateTiquet(idEvent, updatingData) {
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.patch(customURL, updatingData);
}
