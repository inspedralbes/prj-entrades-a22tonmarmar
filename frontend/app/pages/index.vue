<script setup>
import Layout from "./layout.vue";
import EventsPreviewList from "~/shared/organisms/EventsPreviewList.vue";
import { getEvents } from "~/services/eventsApi";
import { useBookingStore } from "~/stores/useBookingStore";

const router = useRouter();
const bookingStore = useBookingStore();

// SSR: carreguem els esdeveniments al servidor amb useAsyncData
const { data, pending, error } = await useAsyncData(
  "public-events",
  () => getEvents(),
  bookingStore.clearSelectedEvent(),
);

const events = computed(() => {
  const raw = data.value;
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? [];
});

const normalizedError = computed(() => {
  if (!error.value) return null;
  if (typeof error.value === "string") return error.value;
  return error.value?.message || "No s'han pogut carregar els esdeveniments.";
});

const handleEventSelection = (event) => {
  if (!event?.id) return;
  if (event.sold_out) return;

  // Guardem l'esdeveniment seleccionat al store de Booking
  bookingStore.setSelectedEvent(event);

  const rawName = String(event.nom || "event");
  const slug = rawName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  router.push(`/events/${slug}`);
};
</script>

<template>
  <Layout>
    <EventsPreviewList
      :events="events"
      :loading="pending"
      :error="normalizedError"
      @select="handleEventSelection"
    />
  </Layout>
</template>
