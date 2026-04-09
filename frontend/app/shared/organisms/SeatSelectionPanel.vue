<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useBookingStore } from "~/stores/useBookingStore";
import SeatLegend from "~/shared/organisms/SeatLegend.vue";
import SeatZonesMap from "~/shared/organisms/SeatZonesMap.vue";
import OrderSummaryPanel from "~/shared/organisms/OrderSummaryPanel.vue";
import MobileSummaryDrawer from "~/shared/organisms/MobileSummaryDrawer.vue";
import BaseButton from "~/shared/atoms/BaseButton.vue";

const bookingStore = useBookingStore();
const { barricadaState, pistaState, butacaStates, totalSelected, selection } =
  storeToRefs(bookingStore);

const isSummaryOpen = ref(false);
const isMobileDrawerOpen = ref(false);
const userClosedSummary = ref(false);

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

watch(
  totalSelected,
  (newValue, oldValue) => {
    if (newValue === 0) {
      isSummaryOpen.value = false;
      isMobileDrawerOpen.value = false;
      userClosedSummary.value = false;
    } else if (oldValue === 0 && newValue > 0 && !userClosedSummary.value) {
      isSummaryOpen.value = true;
    }
  },
);

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
    if (payload.id !== "barricada" && payload.id !== "pista") return;

    const current = selection.value[payload.id] || 0;

    if (current === 0) {
      if (payload.id === "barricada") {
        bookingStore.incrementBarricada();
      } else if (payload.id === "pista") {
        bookingStore.incrementPista();
      }
    }

    if (totalSelected.value > 0 && !userClosedSummary.value) {
      isSummaryOpen.value = true;
      isMobileDrawerOpen.value = true;
      userClosedSummary.value = false;
    }
  } else if (payload.type === "seat") {
    bookingStore.toggleSeat(payload.id);
    if (totalSelected.value > 0 && !userClosedSummary.value) {
      isSummaryOpen.value = true;
      userClosedSummary.value = false;
    }
  }
};

const handleCloseSummary = () => {
  isSummaryOpen.value = false;
  userClosedSummary.value = true;
};

const handleOpenSummary = () => {
  if (totalSelected.value === 0) return;
  isSummaryOpen.value = true;
  userClosedSummary.value = false;
};

const handleOpenMobileDrawer = () => {
  if (totalSelected.value === 0) return;
  isMobileDrawerOpen.value = true;
};

const handleCloseMobileDrawer = () => {
  isMobileDrawerOpen.value = false;
};

const handleGoToCheckout = () => {
  // TODO: implementar navegació a la vista de compra
};
</script>

<template>
  <section
    class="relative flex flex-col gap-6 md:grid md:grid-cols-[auto,1fr,320px] md:items-start"
  >
    <SeatLegend class="md:sticky md:top-4" />

    <div class="space-y-4">
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

      <div v-if="totalSelected > 0 && !isSummaryOpen" class="hidden md:block">
        <BaseButton variant="secondary" @click="handleOpenSummary">
          Mostrar resum
        </BaseButton>
      </div>
    </div>

    <div class="hidden md:block md:pl-4 md:border-l md:border-slate-800">
      <OrderSummaryPanel
        v-if="totalSelected > 0 && isSummaryOpen"
        class="md:sticky md:top-4"
        @close="handleCloseSummary"
        @go-to-checkout="handleGoToCheckout"
      />
    </div>

    <!-- Botó flotant per obrir el drawer en mòbil -->
    <div
      v-if="totalSelected > 0"
      class="fixed bottom-4 right-4 z-30 md:hidden"
    >
      <BaseButton @click="handleOpenMobileDrawer">
        Resum ({{ totalSelected }})
      </BaseButton>
    </div>

    <MobileSummaryDrawer
      :open="isMobileDrawerOpen"
      @close="handleCloseMobileDrawer"
      @go-to-checkout="handleGoToCheckout"
    />
  </section>
</template>
