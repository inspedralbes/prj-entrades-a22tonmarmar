<script setup>
import BaseModal from "@/shared/atoms/BaseModal.vue";
import BaseButton from "@/shared/atoms/BaseButton.vue";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "Operació completada correctament.",
  },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <BaseModal :visible="visible" @close="emit('close')">
    <template #header>
      <BaseHeading :level="2">Operació correcta</BaseHeading>
    </template>

    <p class="text-sm text-slate-100">
      {{ message }}
    </p>

    <template #footer>
      <BaseButton @click="emit('close')">D'acord</BaseButton>
    </template>
  </BaseModal>
</template>
