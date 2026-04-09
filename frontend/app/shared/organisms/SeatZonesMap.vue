<script setup>
import SeatButton from "~/shared/molecules/SeatButton.vue";

const emit = defineEmits(["seat-clicked"]);

const props = defineProps({
  zones: {
    type: Object,
    required: true,
    // { barricada: { state }, pista: { state } }
  },
  butacas: {
    type: Array,
    default: () => [],
    // [{ value: 'A-1', uiState: 'available' | 'onHold' | 'selected' | 'sold' }]
  },
});

const handleZoneClick = (zone) => {
  emit("seat-clicked", { type: "zone", id: zone });
};

const handleSeatClick = (label) => {
  emit("seat-clicked", { type: "seat", id: label });
};
</script>

<template>
  <section
    class="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 rounded-lg border border-slate-700 bg-slate-900/70 px-6 py-8"
  >
    <!-- Barricada -->
    <div class="w-full max-w-2xl flex justify-center">
      <div class="w-[70%]">
        <SeatButton
          :state="zones.barricada.state"
          label="Barricada"
          shape="block"
          :interactive="zones.barricada.interactive !== false"
          @click="handleZoneClick('barricada')"
        />
      </div>
    </div>

    <!-- Pista -->
    <div class="w-full max-w-2xl flex justify-center">
      <div class="w-[90%]">
        <SeatButton
          :state="zones.pista.state"
          label="Pista"
          shape="block"
          :tall="true"
          :interactive="zones.pista.interactive !== false"
          @click="handleZoneClick('pista')"
        />
      </div>
    </div>

    <!-- Butaques A-1..A-10 -->
    <div class="mt-4 flex w-full max-w-2xl justify-center">
      <div class="w-[90%] grid grid-cols-10 gap-2">
        <SeatButton
          v-for="seat in butacas"
          :key="seat.value"
          :state="seat.uiState"
          :label="seat.value"
          shape="seat"
          :interactive="seat.uiState !== 'sold' && seat.uiState !== 'onHold'"
          @click="handleSeatClick(seat.value)"
        />
      </div>
    </div>
  </section>
</template>
