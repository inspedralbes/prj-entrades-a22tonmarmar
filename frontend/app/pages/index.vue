<script setup>
import Layout from "./layout.vue";
import EventsPreviewList from "~/shared/organisms/EventsPreviewList.vue";
import { getEvents } from "~/services/eventsApi";

const router = useRouter();

// SSR: carreguem els esdeveniments al servidor amb useAsyncData
const { data, pending, error } = await useAsyncData("public-events", () =>
  getEvents(),
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
  router.push(`/events/${event.id}`);
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
