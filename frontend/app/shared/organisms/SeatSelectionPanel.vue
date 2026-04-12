<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useBookingStore } from "~/stores/useBookingStore";
import { getEventRoom } from "~/services/eventsApi";
import { startCheckout } from "~/services/ordersApi";
import {
  connectSockets,
  joinEventRoom,
  leaveEventRoom,
  onRoomUpdated,
  offRoomUpdated,
} from "@/services/socketService";
import SeatLegend from "~/shared/organisms/SeatLegend.vue";
import SeatZonesMap from "~/shared/organisms/SeatZonesMap.vue";
import OrderSummaryPanel from "~/shared/organisms/OrderSummaryPanel.vue";
import MobileSummaryDrawer from "~/shared/organisms/MobileSummaryDrawer.vue";
import BaseButton from "~/shared/atoms/BaseButton.vue";
import SuccessModal from "~/shared/organisms/SuccessModal.vue";

const router = useRouter();
const bookingStore = useBookingStore();
const {
  barricadaState,
  pistaState,
  butacaStates,
  totalSelected,
  selection,
  selectedEvent,
} = storeToRefs(bookingStore);

const isSummaryOpen = ref(false);
const isMobileDrawerOpen = ref(false);
const userClosedSummary = ref(false);
const isProcessing = ref(false);
const currentEventRoomId = ref(null);
const isResultModalOpen = ref(false);
const resultModalMessage = ref("");
let roomUpdatedHandler = null;

onMounted(async () => {
  const event = selectedEvent.value;

  // 1) Carreguem l'estat real de la sala des del backend
  if (event && event.id) {
    try {
      const result = await getEventRoom(event.id);

      if (result && result.success && result.room) {
        const availability = mapRoomToAvailability(result.room);
        bookingStore.setAvailability(availability);
        // En carregar l'estat inicial de la sala, netegem la selecció local
        bookingStore.resetSelection();
      }
    } catch (error) {
      console.error(
        error?.message || "No s'ha pogut carregar l'estat de la sala",
      );
      // Si falla, mantenim l'estat per defecte (tots 0) i deixem que sockets l'actualitzi
    }
  }

  // 2) Connexió de sockets i subscripció a la room de l'event
  if (import.meta.client) {
    const config = useRuntimeConfig();
    const baseUrl = config.public.socketsBase || "http://localhost:4000";

    connectSockets(baseUrl);

    if (event && event.id) {
      console.log("[WS client] Mount SeatSelectionPanel for event", event.id);
      currentEventRoomId.value = event.id;
      joinEventRoom(event.id);
    }

    roomUpdatedHandler = (payload) => {
      console.log("[WS client] room_updated payload", payload);
      const room = payload?.room || payload;
      const availability = mapRoomToAvailability(room);
      console.log(
        "[FLOW][front] roomUpdatedHandler → availability",
        availability,
      );
      bookingStore.setAvailability(availability);
    };

    onRoomUpdated(roomUpdatedHandler);
  }
});

onUnmounted(() => {
  if (currentEventRoomId.value != null) {
    leaveEventRoom(currentEventRoomId.value);
  }

  if (roomUpdatedHandler) {
    offRoomUpdated(roomUpdatedHandler);
    roomUpdatedHandler = null;
  }
});

watch(totalSelected, (newValue, oldValue) => {
  if (newValue === 0) {
    isSummaryOpen.value = false;
    isMobileDrawerOpen.value = false;
    userClosedSummary.value = false;
  } else if (oldValue === 0 && newValue > 0 && !userClosedSummary.value) {
    isSummaryOpen.value = true;
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

function mapRoomToAvailability(room) {
  if (!room) {
    return {
      barricada: 0,
      pista: 0,
      butaca: [],
    };
  }

  const barricada =
    (room.barricada_total || 0) - (room.barricada_reserved || 0);
  const pista = (room.pista_total || 0) - (room.pista_reserved || 0);

  const butaca = Array.from({ length: 10 }, (_, index) => {
    const field = `A${index + 1}`;
    const backendState = room[field];
    let state = backendState || "Disponible";

    // Mapegem l'estat de backend "Reservado" a l'estat de front "En tramite"
    if (state === "Reservado") {
      state = "En tramite";
    }

    return {
      value: `A-${index + 1}`,
      state,
    };
  });

  return { barricada, pista, butaca };
}

const handleGoToCheckout = async () => {
  if (isProcessing.value) return;
  if (totalSelected.value === 0) return;

  const event = selectedEvent.value;
  if (!event || !event.id) return;

  console.log("[FLOW][front] handleGoToCheckout selection", {
    selection: selection.value,
    totalSelected: totalSelected.value,
    eventId: event.id,
  });

  const selectionSnapshot = {
    barricada: selection.value.barricada || 0,
    pista: selection.value.pista || 0,
    // Convertim "A-1" -> "A1" per al backend
    butaques: Array.isArray(selection.value.butaca)
      ? selection.value.butaca.map((label) => label.replace("A-", "A"))
      : [],
  };

  const payload = {
    barricada: selectionSnapshot.barricada,
    pista: selectionSnapshot.pista,
    butaques: selectionSnapshot.butaques,
  };

  console.log("[FLOW][front] handleGoToCheckout payload to backend", {
    eventId: event.id,
    payload,
  });

  isProcessing.value = true;
  try {
    const result = await startCheckout(event.id, payload);

    console.log(
      "[FLOW][front] handleGoToCheckout response from backend",
      result,
    );

    if (!result || result.success === false) {
      const message =
        result?.message ||
        "L'operació ha tingut algun problema, torna-hi una altra vegada";
      console.error(message);
      resultModalMessage.value = message;
      isResultModalOpen.value = true;
      return;
    }

    const room = result.room;
    const availability = mapRoomToAvailability(room);
    bookingStore.setAvailability(availability);

    const orderId = result.order_id;

    if (orderId) {
      router.push({
        name: "events-checkout",
        query: { orderId },
      });
    } else {
      const message = "No s'ha rebut cap order_id en iniciar el checkout";
      console.error(message);
      resultModalMessage.value =
        "L'operació ha tingut algun problema, torna-hi una altra vegada";
      isResultModalOpen.value = true;
    }
  } catch (error) {
    console.error("[FLOW][front] handleGoToCheckout error", error);
    const message =
      error?.message || "Error al comunicar amb el servidor de comandes.";
    console.error(message);
    resultModalMessage.value =
      "L'operació ha tingut algun problema, torna-hi una altra vegada";
    isResultModalOpen.value = true;
  } finally {
    isProcessing.value = false;
  }
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
        :loading="isProcessing"
        @close="handleCloseSummary"
        @go-to-checkout="handleGoToCheckout"
      />
    </div>

    <!-- Botó flotant per obrir el drawer en mòbil -->
    <div v-if="totalSelected > 0" class="fixed bottom-4 right-4 z-30 md:hidden">
      <BaseButton @click="handleOpenMobileDrawer">
        Resum ({{ totalSelected }})
      </BaseButton>
    </div>

    <MobileSummaryDrawer
      :open="isMobileDrawerOpen"
      :loading="isProcessing"
      @close="handleCloseMobileDrawer"
      @go-to-checkout="handleGoToCheckout"
    />

    <SuccessModal
      :visible="isResultModalOpen"
      type="error"
      :message="resultModalMessage"
      @close="isResultModalOpen = false"
    />
  </section>
</template>
