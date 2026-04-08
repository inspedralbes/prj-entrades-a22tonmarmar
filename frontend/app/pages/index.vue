<script setup>
import EventPreviewModal from "~/shared/organisms/EventPreviewModal.vue";
import Layout from "./layout.vue";

const router = useRouter();

const events = ref([]);
const loadingList = ref(false);
const listError = ref(null);

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

const handleEventSelection = () => {
  router.push('/')
}

onMounted(fetchEvents);
</script>

<template>
  <Layout />
  <main>
    <EventPreviewModal events="events" />
  </main>
</template>
