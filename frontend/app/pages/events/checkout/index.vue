<script setup>
import Layout from "../../layout.vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useBookingStore } from "~/stores/useBookingStore";
import CheckoutPanel from "~/shared/organisms/CheckoutPanel.vue";

const router = useRouter();
const bookingStore = useBookingStore();
const { hasSelectedEvent } = storeToRefs(bookingStore);

// Si s'accedeix directament sense event seleccionat, redirigim a l'inici
if (!hasSelectedEvent.value) {
  router.replace("/");
}
</script>

<template>
  <Layout>
    <CheckoutPanel />
  </Layout>
</template>
