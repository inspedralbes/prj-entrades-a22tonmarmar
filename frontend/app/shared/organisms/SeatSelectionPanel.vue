<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useBookingStore } from "~/stores/useBookingStore";
import SeatLegend from "~/shared/organisms/SeatLegend.vue";
import SeatZonesMap from "~/shared/organisms/SeatZonesMap.vue";

const bookingStore = useBookingStore();
const { barricadaState, pistaState, butacaStates, totalSelected } =
  storeToRefs(bookingStore);

// DEMO: si no hi ha disponibilitat carregada, creem una default per poder veure el mapa
onMounted(() => {
  if (
    bookingStore.availability.barricada === 0 &&
    bookingStore.availability.pista === 0 &&
    (!bookingStore.availability.butaca ||
      bookingStore.availability.butaca.length === 0)
  ) {
    bookingStore.setAvailability({
      barricada: 10,
      pista: 50,
      butaca: Array.from({ length: 10 }, (_, index) => ({
        value: `A-${index + 1}`,
        state: "Disponible",
      })),
    });
  }
});

const zones = computed(() => ({
  barricada: {
    state: barricadaState.value,
    interactive: barricadaState.value !== "sold",
  },
  pista: {
    state: pistaState.value,
    interactive: pistaState.value !== "sold",
  },
}));

const butacasForMap = computed(() => {
  const list = butacaStates.value || [];
  if (list.length > 0) return list;

  // Fallback per si encara no hi ha disponibilitat de backend
  return Array.from({ length: 10 }, (_, index) => ({
    value: `A-${index + 1}`,
    uiState: "available",
  }));
});

const handleSeatClicked = (payload) => {
  if (!payload) return;
  if (payload.type === "zone") {
    bookingStore.toggleZone(payload.id);
  } else if (payload.type === "seat") {
    bookingStore.toggleSeat(payload.id);
  }
};
</script>

<template>
  <section class="flex flex-col gap-6 md:flex-row md:items-start">
    <SeatLegend class="md:sticky md:top-4" />

    <div class="flex-1 space-y-4">
      <SeatZonesMap
        :zones="zones"
        :butacas="butacasForMap"
        @seat-clicked="handleSeatClicked"
      />

      <p class="text-sm text-slate-300">
        Has seleccionat
        <span class="font-semibold text-pink-300">{{ totalSelected }}</span>
        / 6 seients.
      </p>
    </div>
  </section>
</template>
