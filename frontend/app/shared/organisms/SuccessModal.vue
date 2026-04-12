<script setup>
import { computed } from "vue";
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
    default: "",
  },
  type: {
    type: String,
    default: "success", // 'success' | 'error'
  },
});

const emit = defineEmits(["close"]);

const title = computed(() => {
  if (props.type === "error") {
    return "L'operació ha tingut algun problema";
  }
  return "L'operació ha sigut correcta";
});

const effectiveMessage = computed(() => {
  if (props.message) return props.message;
  if (props.type === "error") {
    return "L'operació ha tingut algun problema, torna-hi una altra vegada";
  }
  return "L'operació ha sigut correcta";
});
</script>

<template>
  <BaseModal :visible="visible" @close="emit('close')">
    <template #header>
      <BaseHeading :level="2">{{ title }}</BaseHeading>
    </template>

    <p class="text-sm text-slate-100">
      {{ effectiveMessage }}
    </p>

    <template #footer>
      <BaseButton @click="emit('close')">D'acord</BaseButton>
    </template>
  </BaseModal>
</template>
