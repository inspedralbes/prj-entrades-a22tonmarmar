<script setup>
import SeatStateDot from "~/shared/atoms/SeatStateDot.vue";

const props = defineProps({
  state: {
    type: String,
    default: "available", // available | onHold | selected | sold
  },
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex items-center gap-2 text-sm text-slate-200">
    <SeatStateDot :state="state" />
    <span>{{ label }}</span>
  </div>
</template>
