<script setup>
const props = defineProps({
  totalTickets: {
    type: Number,
    default: 0,
  },
  barricadaTotal: {
    type: Number,
    default: 0,
  },
  pistaTotal: {
    type: Number,
    default: 0,
  },
  butacaTotal: {
    type: Number,
    default: 0,
  },
  grandTotal: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="space-y-1 rounded-md bg-slate-900/80 px-3 py-2 text-xs text-slate-100">
    <h3 class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      Resum econòmic
    </h3>
    <p class="flex items-center justify-between text-[11px]">
      <span>Entrades totals</span>
      <span class="font-semibold">{{ totalTickets }}</span>
    </p>
    <p v-if="barricadaTotal > 0" class="flex items-center justify-between text-[11px]">
      <span>Barricada</span>
      <span class="font-medium">{{ barricadaTotal }} &euro;</span>
    </p>
    <p v-if="pistaTotal > 0" class="flex items-center justify-between text-[11px]">
      <span>Pista</span>
      <span class="font-medium">{{ pistaTotal }} &euro;</span>
    </p>
    <p v-if="butacaTotal > 0" class="flex items-center justify-between text-[11px]">
      <span>Butaques</span>
      <span class="font-medium">{{ butacaTotal }} &euro;</span>
    </p>
    <div class="mt-1 border-t border-slate-700 pt-1 text-[11px]">
      <p class="flex items-center justify-between">
        <span class="font-semibold">Total</span>
        <span class="text-sm font-bold text-pink-300">{{ grandTotal }} &euro;</span>
      </p>
    </div>
  </div>
</template>
