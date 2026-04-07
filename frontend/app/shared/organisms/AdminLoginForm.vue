<script setup>
import { ref } from "vue";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";
import BaseButton from "@/shared/atoms/BaseButton.vue";
import BaseInput from "@/shared/atoms/BaseInput.vue";
import FormField from "@/shared/molecules/FormField.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [String, null],
    default: null,
  },
});

const emit = defineEmits(["submit"]);

const email = ref("");
const password = ref("");

const handleSubmit = () => {
  emit("submit", {
    email: email.value,
    password: password.value,
  });
};
</script>

<template>
  <section
    class="flex items-center justify-center bg-slate-950 text-slate-50 px-4 py-10"
  >
    <div
      class="w-full max-w-md rounded-xl border border-pink-700/40 bg-slate-900/90 p-6 shadow-xl"
    >
      <header class="mb-6 text-center">
        <BaseHeading :level="1">Accés administració</BaseHeading>
      </header>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <FormField label="Correu electrònic">
          <BaseInput
            v-model="email"
            type="email"
            autocomplete="email"
            required
          />
        </FormField>

        <FormField label="Contrasenya">
          <BaseInput
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
          />
        </FormField>

        <p v-if="props.error" class="text-sm text-red-400">
          {{ props.error }}
        </p>

        <BaseButton
          class="w-full justify-center"
          type="submit"
          :disabled="props.loading"
        >
          <span v-if="!props.loading">Entrar</span>
          <span v-else>Entrant...</span>
        </BaseButton>
      </form>
    </div>
  </section>
</template>
