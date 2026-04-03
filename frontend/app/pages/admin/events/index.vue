<script setup>
import { onMounted, ref } from "vue";
import EventsList from "@/shared/organisms/EventsList.vue";
import { getEvents } from "@/services/eventsApi";

const events = ref([]);
const loadingList = ref(false);
const listError = ref(null);

const isCreateOpen = ref(false);
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);
const isPreviewOpen = ref(false);

const fetchEvents = async () => {
  loadingList.value = true;
  listError.value = null;

  try {
    const data = await getEvents();
    events.value = Array.isArray(data) ? data : (data?.data ?? []);
  } catch (error) {
    listError.value =
      error?.message || "No s'han pogut carregar els esdeveniments.";
  } finally {
    loadingList.value = false;
  }
};

onMounted(fetchEvents);

const handleCreateRequest = () => {
  isCreateOpen.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <EventsList
      :events="events"
      :loading="loadingList"
      :error="listError"
      @create="handleCreateRequest"
    />
  </div>
</template>
