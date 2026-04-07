<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthApi } from "~/services/authApi";
import { useAuthStore } from "~/stores/auth";
import AdminLoginForm from "@/shared/organisms/AdminLoginForm.vue";
import AdminLayout from "@/pages/admin/layout.vue";

const loading = ref(false);
const errorMessage = ref("");

const router = useRouter();
const authApi = useAuthApi();
const authStore = useAuthStore();

const handleSubmit = async ({ email, password }) => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const data = await authApi.login({
      email,
      password,
    });

    authStore.setAuth({ token: data.token, user: data.user });

    await router.push("/admin/events");
  } catch (error) {
    errorMessage.value =
      error?.message || "No s'ha pogut iniciar sessió. Revisa les dades.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AdminLayout>
    <div class="flex flex-1 items-center justify-center px-4">
      <div class="w-full max-w-md">
        <AdminLoginForm
          :loading="loading"
          :error="errorMessage"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </AdminLayout>
</template>
