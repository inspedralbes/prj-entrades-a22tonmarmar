<script setup>
import BaseModal from "@/shared/atoms/BaseModal.vue";
import BaseButton from "@/shared/atoms/BaseButton.vue";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  eventName: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
  <BaseModal :visible="visible" @close="emit('cancel')">
    <template #header>
      <BaseHeading :level="2">Confirmar eliminaci&oacute;</BaseHeading>
    </template>

    <p class="text-sm text-slate-100">
      Segur que vols eliminar l'esdeveniment
      <span v-if="eventName" class="font-semibold">"{{ eventName }}"</span>
      ? Aquesta acci&oacute; no es pot desfer.
    </p>

    <template #footer>
      <BaseButton
        variant="secondary"
        :disabled="loading"
        @click="emit('cancel')"
      >
        Cancel&middot;lar
      </BaseButton>
      <BaseButton
        variant="danger"
        :disabled="loading"
        @click="emit('confirm')"
      >
        {{ loading ? "Eliminant..." : "Eliminar" }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
