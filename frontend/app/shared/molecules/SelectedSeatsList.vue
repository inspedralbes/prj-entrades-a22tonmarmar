<script setup>
const props = defineProps({
  seats: {
    type: Array,
    default: () => [],
  },
  removable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["remove-seat"]);

const handleRemove = (label) => {
  emit("remove-seat", label);
};
</script>

<template>
  <div class="space-y-1 text-xs text-slate-200">
    <h3 class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      Butaques seleccionades
    </h3>
    <p v-if="!seats || seats.length === 0" class="text-[11px] text-slate-500">
      Encara no hi ha butaques seleccionades.
    </p>
    <ul v-else class="max-h-28 space-y-1 overflow-y-auto pr-1">
      <li
        v-for="seat in seats"
        :key="seat"
        class="flex items-center justify-between rounded bg-slate-900/70 px-2 py-1"
      >
        <span class="text-[11px] font-medium text-slate-100">{{ seat }}</span>
        <button
          v-if="removable"
          type="button"
          class="text-[10px] font-semibold uppercase tracking-wide text-pink-300 hover:text-pink-200"
          @click="handleRemove(seat)"
        >
          treure
        </button>
      </li>
    </ul>
  </div>
</template>
