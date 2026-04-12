<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Layout from "../layout.vue";
import BaseButton from "~/shared/atoms/BaseButton.vue";
import { useBookingStore } from "~/stores/useBookingStore";

const router = useRouter();
const bookingStore = useBookingStore();
const { completedOrder, selectedEvent } = storeToRefs(bookingStore);

const hasCompletedOrder = computed(() => !!completedOrder.value);

onMounted(() => {
  if (!hasCompletedOrder.value) {
    const event = selectedEvent.value;
    if (event && event.nom) {
      const rawName = String(event.nom || "event");
      const slug = rawName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      router.replace(`/events/${slug}`);
    } else {
      router.replace("/");
    }
  }
});

const tickets = computed(() => completedOrder.value?.tiquets || []);
const total = computed(() => completedOrder.value?.total ?? 0);
const orderId = computed(() => completedOrder.value?.id ?? null);

const handleGoHome = () => {
  bookingStore.clearCompletedOrder();
  bookingStore.clearSelectedEvent();
  router.push("/");
};
</script>

<template>
  <Layout>
    <section
      v-if="hasCompletedOrder"
      class="mx-auto max-w-3xl space-y-6 px-4 py-10 text-slate-50"
    >
      <header class="space-y-2">
        <h1 class="text-2xl font-bold">Compra completada</h1>
        <p class="text-sm text-slate-300">
          Gràcies per la teva compra. A continuació trobaràs el resum dels
          tiquets.
        </p>
      </header>

      <div class="rounded-lg border border-emerald-500/40 bg-slate-900/80 p-4">
        <p class="text-sm text-emerald-300">
          La teva compra s'ha completat correctament.
        </p>
        <p v-if="orderId" class="mt-1 text-xs text-slate-400">
          ID de compra:
          <span class="font-mono text-slate-200">{{ orderId }}</span>
        </p>
      </div>

      <section class="space-y-3 rounded-lg border border-slate-700 bg-slate-900/70 p-4">
        <header class="flex items-center justify-between text-sm">
          <div>
            <h2 class="font-semibold">Detall dels tiquets</h2>
            <p v-if="selectedEvent" class="text-xs text-slate-400">
              Event: <span class="font-medium">{{ selectedEvent.nom }}</span>
            </p>
          </div>
        </header>

        <div v-if="tickets.length > 0" class="space-y-1 text-xs">
          <div
            v-for="(ticket, index) in tickets"
            :key="`${ticket.type}-${ticket.butaca || index}`"
            class="flex items-center justify-between rounded border border-slate-800 bg-slate-900/60 px-3 py-2"
          >
            <div class="space-y-0.5">
              <p class="font-medium text-slate-100">
                <span v-if="ticket.type === 'preu_barricada'">Barricada</span>
                <span v-else-if="ticket.type === 'preu_butaca'">Butaca</span>
                <span v-else>Pista</span>
              </p>
              <p v-if="ticket.butaca" class="text-[11px] text-slate-400">
                Seient: <span class="font-mono">{{ ticket.butaca }}</span>
              </p>
            </div>
            <p class="text-sm font-semibold text-emerald-300">
              {{ Number(ticket.price ?? 0).toFixed(2) }} €
            </p>
          </div>
        </div>
        <p v-else class="text-xs text-slate-400">
          No s'han trobat tiquets en aquesta compra.
        </p>

        <div class="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 text-sm">
          <span class="font-semibold">Total</span>
          <span class="text-lg font-bold text-emerald-300">
            {{ Number(total).toFixed(2) }} €
          </span>
        </div>
      </section>

      <div class="pt-2">
        <BaseButton class="w-full justify-center" @click="handleGoHome">
          Tornar a la pàgina principal
        </BaseButton>
      </div>
    </section>
  </Layout>
</template>
