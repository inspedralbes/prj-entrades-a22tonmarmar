<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";
import BaseButton from "@/shared/atoms/BaseButton.vue";
import { useAuthStore } from "@/stores/auth";
import { useAuthApi } from "@/services/authApi";

const authStore = useAuthStore();
const authApi = useAuthApi();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleLogout = async () => {
  try {
    await authApi.logout();
  } finally {
    authStore.clearAuth();
    router.push("/admin");
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100">
    <header class="border-b border-slate-800 bg-slate-900/90">
      <div
        class="flex w-full items-center justify-between px-3 sm:px-4 py-2 gap-3"
      >
        <BaseHeading :level="2">Sala BinguS</BaseHeading>

        <BaseButton
          v-if="isAuthenticated"
          variant="secondary"
          class="whitespace-nowrap"
          @click="handleLogout"
        >
          Tancar sessió
        </BaseButton>
      </div>
    </header>

    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
