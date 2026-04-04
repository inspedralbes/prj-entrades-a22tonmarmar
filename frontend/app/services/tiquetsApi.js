import { useApiClient } from "@/utils/apiClient";

const baseURL = "/tiquets";

export function getTiquetById(idEvent) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.get(customURL);
}

export function updateTiquet(idEvent, updatingData) {
  const apiClient = useApiClient();
  const customURL = `${baseURL}/${idEvent}`;
  return apiClient.patch(customURL, updatingData);
}
