<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useBookingStore } from "~/stores/useBookingStore";
import BaseButton from "~/shared/atoms/BaseButton.vue";
import TicketTypeRow from "~/shared/molecules/TicketTypeRow.vue";
import SelectedSeatsList from "~/shared/molecules/SelectedSeatsList.vue";
import OrderTotalsBox from "~/shared/molecules/OrderTotalsBox.vue";

const emit = defineEmits(["close", "go-to-checkout"]);

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const bookingStore = useBookingStore();
const {
  selection,
  selectedEvent,
  totalSelected,
  barricadaState,
  pistaState,
  canAddBarricada,
  canAddPista,
  canRemoveBarricada,
  canRemovePista,
} = storeToRefs(bookingStore);

const prices = computed(() => {
  const tiquet = selectedEvent.value?.tiquet || {};
  const base =
    tiquet.preu_base !== null && tiquet.preu_base !== undefined
      ? Number(tiquet.preu_base)
      : null;
  const barricada =
    tiquet.preu_barricada !== null && tiquet.preu_barricada !== undefined
      ? Number(tiquet.preu_barricada)
      : null;
  const butaca =
    tiquet.preu_butaca !== null && tiquet.preu_butaca !== undefined
      ? Number(tiquet.preu_butaca)
      : null;
  return {
    base: Number.isNaN(base) ? null : base,
    barricada: Number.isNaN(barricada) ? null : barricada,
    butaca: Number.isNaN(butaca) ? null : butaca,
  };
});

const barricadaCount = computed(() => selection.value.barricada || 0);
const pistaCount = computed(() => selection.value.pista || 0);
const butacaCount = computed(() => selection.value.butaca?.length || 0);

const barricadaTotal = computed(() => {
  if (!prices.value.barricada || barricadaCount.value === 0) return 0;
  return barricadaCount.value * prices.value.barricada;
});

const pistaTotal = computed(() => {
  if (!prices.value.base || pistaCount.value === 0) return 0;
  return pistaCount.value * prices.value.base;
});

const butacaTotal = computed(() => {
  if (!prices.value.butaca || butacaCount.value === 0) return 0;
  return butacaCount.value * prices.value.butaca;
});

const grandTotal = computed(
  () => barricadaTotal.value + pistaTotal.value + butacaTotal.value,
);

const handleIncrementBarricada = () => {
  bookingStore.incrementBarricada();
};

const handleDecrementBarricada = () => {
  bookingStore.decrementBarricada();
};

const handleIncrementPista = () => {
  bookingStore.incrementPista();
};

const handleDecrementPista = () => {
  bookingStore.decrementPista();
};

const handleRemoveSeat = (label) => {
  bookingStore.toggleSeat(label);
};
</script>

<template>
  <aside
    class="flex w-full max-w-xs flex-col gap-3 rounded-lg border border-slate-700 bg-slate-900/90 p-4 text-slate-50 shadow-lg"
  >
    <header class="mb-1 flex items-start justify-between gap-2">
      <div>
        <h2 class="text-sm font-semibold">Resum del pedido</h2>
        <p class="text-[11px] text-slate-400">
          Has seleccionat
          <span class="font-semibold text-pink-300">{{ totalSelected }}</span>
          / 6 entrades.
        </p>
      </div>
      <button
        type="button"
        class="text-[10px] font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-200"
        @click="emit('close')"
      >
        Ocultar
      </button>
    </header>

    <div class="space-y-2 text-xs">
      <TicketTypeRow
        label="Barricada"
        :state="barricadaState"
        :count="barricadaCount"
        :unit-price="prices.barricada"
        :can-increment="canAddBarricada"
        :can-decrement="canRemoveBarricada"
        @increment="handleIncrementBarricada"
        @decrement="handleDecrementBarricada"
      />

      <TicketTypeRow
        label="Pista"
        :state="pistaState"
        :count="pistaCount"
        :unit-price="prices.base"
        :can-increment="canAddPista"
        :can-decrement="canRemovePista"
        @increment="handleIncrementPista"
        @decrement="handleDecrementPista"
      />
    </div>

    <SelectedSeatsList
      class="mt-1"
      :seats="selection.butaca"
      @remove-seat="handleRemoveSeat"
    />

    <OrderTotalsBox
      class="mt-2"
      :total-tickets="totalSelected"
      :barricada-total="barricadaTotal"
      :pista-total="pistaTotal"
      :butaca-total="butacaTotal"
      :grand-total="grandTotal"
    />

    <div class="mt-2 pt-1">
      <BaseButton
        class="w-full justify-center text-sm"
        :disabled="totalSelected === 0 || props.loading"
        @click="emit('go-to-checkout')"
      >
        {{ props.loading ? "Procesando" : "Ir a compra" }}
      </BaseButton>
    </div>
  </aside>
</template>
