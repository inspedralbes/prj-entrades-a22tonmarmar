<script setup>
import Layout from "../layout.vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useBookingStore } from "~/stores/useBookingStore";

const route = useRoute();
const router = useRouter();

const bookingStore = useBookingStore();
const { selectedEvent, hasSelectedEvent } = storeToRefs(bookingStore);

// Si se entra directamente sin pasar por la home, de momento devolvemos al inicio
if (!hasSelectedEvent.value) {
  router.replace("/");
}

const isShown = false;
</script>

<template>
  <Layout>
    <section
      v-if="hasSelectedEvent"
      class="max-w-5xl mx-auto py-10 px-4 space-y-8"
    >
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-slate-50">
          {{ selectedEvent.nom }}
        </h1>
        <p v-if="selectedEvent.artista" class="text-lg text-slate-200">
          {{ selectedEvent.artista }}
        </p>
        <p class="text-sm text-slate-400">
          Vista 2 · Selecció de seients (esquelet inicial)
        </p>
      </header>

      <!-- Placeholder per al mapa de seients / panell visual -->
      <div
        class="rounded-xl border border-slate-700 bg-slate-900/60 p-6 space-y-4"
      >
        <h2 class="text-lg font-semibold text-slate-100 mb-2">
          Mapa de seients (pendents d'implementar)
        </h2>
        <p class="text-sm text-slate-300">
          Aquí anirà el panell visual de selecció de seients (barricada, pista,
          butaques)
        </p>
      </div>
    </section>
  </Layout>
</template>
