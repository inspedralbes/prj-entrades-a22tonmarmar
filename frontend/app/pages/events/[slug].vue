<script setup>
import Layout from "../layout.vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useBookingStore } from "~/stores/useBookingStore";
import SeatSelectionPanel from "~/shared/organisms/SeatSelectionPanel.vue";

const route = useRoute();
const router = useRouter();

const bookingStore = useBookingStore();
const { selectedEvent, hasSelectedEvent } = storeToRefs(bookingStore);

// Si se entra directament sense passar per la home, de moment tornem a l'inici
if (!hasSelectedEvent.value) {
  router.replace("/");
}
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
        <p class="text-sm text-slate-400">Vista 2 · Selecció de seients</p>
      </header>

      <SeatSelectionPanel />
    </section>
  </Layout>
</template>
