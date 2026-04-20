<script setup>
import SeatBox from "~/shared/atoms/SeatBox.vue";

const emit = defineEmits(["click"]);

const props = defineProps({
  state: {
    type: String,
    default: "available", // available | onHold | selected | sold
  },
  label: {
    type: String,
    default: "",
  },
  shape: {
    type: String,
    default: "seat", // seat | block
  },
  tall: {
    type: Boolean,
    default: false,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
});

const handleClick = () => {
  if (!props.interactive) return;
  emit("click");
};
</script>

<template>
  <button
    type="button"
    class="w-full focus:outline-none"
    :disabled="!interactive || state === 'sold' || state === 'onHold'"
    @click="handleClick"
  >
    <SeatBox
      :state="state"
      :label="label"
      :shape="shape"
      :tall="tall"
      :interactive="interactive && state !== 'sold' && state !== 'onHold'"
    />
  </button>
</template>
