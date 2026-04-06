import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/admin") || to.path === "/admin") {
    return;
  }

  const authStore = useAuthStore();

  if (import.meta.client && !authStore.token) {
    authStore.initFromStorage?.();
  }

  if (!authStore.token) {
    return navigateTo("/admin");
  }
});
