<script setup>
import { computed } from "vue";
import SeatStateDot from "~/shared/atoms/SeatStateDot.vue";
import QuantityButton from "~/shared/atoms/QuantityButton.vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: "available", // available | onHold | selected | sold
  },
  count: {
    type: Number,
    default: 0,
  },
  unitPrice: {
    type: [Number, String, null],
    default: null,
  },
  canIncrement: {
    type: Boolean,
    default: true,
  },
  canDecrement: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["increment", "decrement"]);

const numericUnitPrice = computed(() => {
  if (props.unitPrice === null || props.unitPrice === undefined) return null;
  const n = Number(props.unitPrice);
  return Number.isNaN(n) ? null : n;
});

const subtotal = computed(() => {
  if (numericUnitPrice.value === null) return null;
  return props.count * numericUnitPrice.value;
});
</script>

<template>
  <div class="flex items-center justify-between gap-3 rounded-md bg-slate-900/80 px-3 py-2">
    <div class="flex flex-1 items-center gap-2 text-xs text-slate-100">
      <div class="flex flex-col">
        <span class="font-medium">{{ label }}</span>
        <span v-if="numericUnitPrice !== null" class="text-[11px] text-slate-400">
          {{ numericUnitPrice }} 
          <span class="text-[10px]">&euro; / entrada</span>
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <QuantityButton icon="-" :disabled="!canDecrement" @click="emit('decrement')" />
      <span class="w-5 text-center text-sm font-semibold text-slate-50">
        {{ count }}
      </span>
      <QuantityButton icon="+" :disabled="!canIncrement" @click="emit('increment')" />
    </div>

    <div class="min-w-[72px] text-right text-[11px] text-slate-300">
      <span v-if="subtotal !== null">{{ subtotal }} &euro;</span>
    </div>
  </div>
</template>
