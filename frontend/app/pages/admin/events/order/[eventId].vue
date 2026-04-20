<script setup>
import { onMounted, ref } from "vue";
import OrdersList from "@/shared/organisms/OrdersList.vue";
import { getOrdersByEvent } from "@/services/ordersApi";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const orders = ref([]);
const loadingList = ref(false);
const listError = ref(null);

const fetchOrders = async () => {
  const eventId = route.params.eventId;
  if (!eventId) return;

  loadingList.value = true;
  listError.value = null;

  try {
    const data = await getOrdersByEvent(eventId);
    orders.value = Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    listError.value =
      error?.message || "No s'han pogut carregar les comandes.";
  } finally {
    loadingList.value = false;
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <OrdersList :orders="orders" :loading="loadingList" :error="listError" />
  </div>
</template>
