<script setup>
import { ref } from "vue";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";

const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [String, Object, null],
    default: null,
  },
});

const expandedOrders = ref({});

function toggleOrder(orderId) {
  expandedOrders.value[orderId] = !expandedOrders.value[orderId];
}

function isExpanded(orderId) {
  return !!expandedOrders.value[orderId];
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("ca-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTicket(ticket) {
  if (!ticket) return "";
  if (ticket.butaca) {
    return `${ticket.type} · ${ticket.butaca}`;
  }
  return ticket.type;
}
</script>

<template>
  <section class="min-h-screen bg-slate-950 py-4 sm:py-8 text-slate-100">
    <div
      class="mx-auto flex h-full max-w-5xl flex-col gap-4 sm:gap-6 px-3 sm:px-4"
    >
      <header>
        <BaseHeading :level="1">Comandes de l'esdeveniment</BaseHeading>
      </header>

      <main
        class="flex-1 rounded-lg border border-pink-700/30 bg-slate-900/80 p-3 sm:p-4 shadow-xl"
      >
        <div v-if="loading" class="py-10 text-center text-sm text-slate-400">
          Carregant comandes...
        </div>

        <div v-else-if="error" class="py-10 text-center text-sm text-red-400">
          {{
            typeof error === "string"
              ? error
              : "S'ha produït un error en carregar les comandes."
          }}
        </div>

        <div
          v-else-if="!props.orders || props.orders.length === 0"
          class="py-10 text-center text-sm text-slate-400"
        >
          Encara no hi ha comandes per a aquest esdeveniment.
        </div>

        <div
          v-else
          class="max-h-[calc(100vh-220px)] overflow-y-auto pr-3 sm:pr-5 space-y-3 text-sm text-slate-100"
        >
          <article
            v-for="order in props.orders"
            :key="order.id"
            class="rounded-lg border border-slate-700/60 bg-slate-900/90 px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm shadow-sm"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 text-left rounded-md bg-slate-900/60 px-2 py-2 sm:px-3 sm:py-2 hover:bg-slate-800/70 transition-colors"
              @click="toggleOrder(order.id)"
            >
              <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <p class="font-medium text-slate-100 break-words">
                  {{ order.email }}
                </p>
                <p class="text-slate-300 text-xs sm:text-sm">
                  {{ formatDate(order.created_at) }}
                </p>
              </div>

              <div class="flex items-center gap-3">
                <span
                  class="inline-flex items-center justify-center rounded-full bg-slate-800 px-2 py-0.5 text-[11px] sm:text-xs text-slate-100"
                >
                  {{ order.num_tiquets }} tiquets
                </span>
                <span
                  class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-100 transition-transform transform"
                  :class="{ 'rotate-180': isExpanded(order.id) }"
                  aria-hidden="true"
                >
                  <Icon name="heroicons:chevron-down" class="h-3 w-3" />
                </span>
              </div>
            </button>

            <div
              v-if="isExpanded(order.id)"
              class="mt-3 rounded-md border border-slate-800 bg-slate-950/40 p-3 sm:p-4 text-[11px] sm:text-xs text-slate-200"
            >
              <div class="mb-3 flex items-center justify-between">
                <p class="font-semibold text-slate-100">
                  Detall del tiquet
                </p>
                <p class="text-[10px] text-slate-400">
                  {{ order.num_tiquets }} tiquets en aquesta comanda
                </p>
              </div>

              <ul class="space-y-1">
                <li
                  v-for="(ticket, index) in order.tiquets || []"
                  :key="index"
                  class="flex items-center justify-between rounded bg-slate-800/70 px-2 py-1"
                >
                  <span class="font-medium text-slate-100">
                    {{ ticket.type }}
                  </span>
                  <span
                    v-if="ticket.butaca"
                    class="text-[10px] sm:text-xs text-slate-300"
                  >
                    Butaca: {{ ticket.butaca }}
                  </span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </main>
    </div>
  </section>
</template>
