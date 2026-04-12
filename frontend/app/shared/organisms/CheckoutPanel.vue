<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useBookingStore } from "~/stores/useBookingStore";
import BaseInput from "~/shared/atoms/BaseInput.vue";
import BaseButton from "~/shared/atoms/BaseButton.vue";
import FormField from "~/shared/molecules/FormField.vue";
import SuccessModal from "~/shared/organisms/SuccessModal.vue";
import { cancelOrder, confirmOrder } from "~/services/ordersApi";

const route = useRoute();
const router = useRouter();

const bookingStore = useBookingStore();
const { selectedEvent, hasSelectedEvent } = storeToRefs(bookingStore);

const remainingSeconds = ref(180);
const isSubmitting = ref(false);
const isCancelling = ref(false);
const isCompleted = ref(false);
const globalError = ref("");
const hasTimedOut = ref(false);

const isResultModalOpen = ref(false);
const resultModalType = ref("success");
const resultModalMessage = ref("");

let intervalId = null;

const orderId = computed(() => route.query.orderId || null);

const form = reactive({
  name: "",
  surname: "",
  email: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
});

const formErrors = reactive({
  name: null,
  surname: null,
  email: null,
  cardNumber: null,
  cardExpiry: null,
  cardCvv: null,
});

const canInteract = computed(
  () =>
    !isSubmitting.value &&
    !isCancelling.value &&
    !isCompleted.value &&
    !hasTimedOut.value,
);

const timerLabel = computed(() => {
  const total = remainingSeconds.value;
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

onMounted(() => {
  // Si no hi ha event seleccionat o no hi ha orderId, tornem a l'inici
  if (!hasSelectedEvent.value || !orderId.value) {
    router.replace("/");
    return;
  }

  intervalId = window.setInterval(() => {
    if (remainingSeconds.value <= 0) {
      window.clearInterval(intervalId);
      intervalId = null;
      handleTimeout();
      return;
    }
    remainingSeconds.value -= 1;
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
});

function resetErrors() {
  globalError.value = "";
  formErrors.name = null;
  formErrors.surname = null;
  formErrors.email = null;
  formErrors.cardNumber = null;
  formErrors.cardExpiry = null;
  formErrors.cardCvv = null;
}

function validateForm() {
  resetErrors();

  let valid = true;

  if (!form.name.trim()) {
    formErrors.name = "El nom és obligatori";
    valid = false;
  }

  if (!form.email.trim()) {
    formErrors.email = "El correu electrònic és obligatori";
    valid = false;
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
    formErrors.email = "Format de correu no vàlid";
    valid = false;
  }

  if (!form.cardNumber.trim()) {
    formErrors.cardNumber = "El número de targeta és obligatori";
    valid = false;
  } else if (form.cardNumber.replace(/\s+/g, "").length < 12) {
    formErrors.cardNumber = "El número de targeta és massa curt";
    valid = false;
  }

  if (!form.cardExpiry.trim()) {
    formErrors.cardExpiry = "La caducitat és obligatòria";
    valid = false;
  }

  if (!form.cardCvv.trim()) {
    formErrors.cardCvv = "El CVV és obligatori";
    valid = false;
  }

  return valid;
}

async function handleConfirm() {
  if (!canInteract.value) return;
  if (!orderId.value) return;

  if (!validateForm()) return;

  isSubmitting.value = true;
  globalError.value = "";

  try {
    const payload = {
      name: form.name,
      surname: form.surname || null,
      email: form.email,
      card_number: form.cardNumber,
      card_expiry: form.cardExpiry,
      card_cvv: form.cardCvv,
    };

    const result = await confirmOrder(orderId.value, payload);

    if (!result || result.success === false || !result.id) {
      globalError.value =
        result?.message || "No s'ha pogut completar la compra.";
      resultModalType.value = "error";
      resultModalMessage.value =
        "L'operació ha tingut algun problema, torna-hi una altra vegada";
      isResultModalOpen.value = true;
      return;
    }

    bookingStore.setCompletedOrder?.({
      id: result.id,
      tiquets: result.tiquets || [],
      total: result.total ?? 0,
    });

    isCompleted.value = true;
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    resultModalType.value = "success";
    resultModalMessage.value = "L'operació ha sigut correcta";
    isResultModalOpen.value = true;
  } catch (error) {
    console.error("[FLOW][front] handleConfirm error", error);
    globalError.value =
      error?.message || "Error al comunicar amb el servidor de comandes.";
    resultModalType.value = "error";
    resultModalMessage.value =
      "L'operació ha tingut algun problema, torna-hi una altra vegada";
    isResultModalOpen.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

async function performCancel(redirect = true) {
  if (!orderId.value) return;

  isCancelling.value = true;
  globalError.value = "";

  try {
    await cancelOrder(orderId.value);
  } catch (error) {
    console.error("[FLOW][front] performCancel error", error);
    // Si falla, simplement mostrem un log però seguim amb la navegació
  } finally {
    isCancelling.value = false;
  }

  if (redirect) {
    if (hasSelectedEvent.value && selectedEvent.value?.nom) {
      const rawName = String(selectedEvent.value.nom || "event");
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
}

async function handleCancelClick() {
  if (!canInteract.value) return;
  await performCancel(true);
}

async function handleTimeout() {
  if (hasTimedOut.value || isCompleted.value) return;
  hasTimedOut.value = true;
  await performCancel(true);
}

function handleResultModalClose() {
  isResultModalOpen.value = false;

  if (resultModalType.value === "success") {
    router.push("/events/confirmation");
  }
}
</script>

<template>
  <section class="max-w-3xl mx-auto py-10 px-4 space-y-8">
    <header class="space-y-2">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-50">
        {{ selectedEvent?.nom || "Procés de compra" }}
      </h1>
      <p v-if="selectedEvent?.artista" class="text-base text-slate-200">
        {{ selectedEvent.artista }}
      </p>
      <p class="text-sm text-slate-400">
        Vista 3
        <span v-if="!isCompleted && !hasTimedOut"
          >· Dades de compra i pagament simulat</span
        >
        <span v-else-if="isCompleted">· Compra completada</span>
        <span v-else>· Reserva expirada</span>
      </p>
    </header>

    <div
      class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-100"
    >
      <p>
        Temps restant per completar la compra:
        <span class="font-mono font-semibold text-pink-300">
          {{ timerLabel }}
        </span>
      </p>
      <span
        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
        :class="{
          'bg-emerald-500/10 text-emerald-300': isCompleted,
          'bg-red-500/10 text-red-300': hasTimedOut,
          'bg-pink-500/10 text-pink-300': !isCompleted && !hasTimedOut,
        }"
      >
        <span v-if="isCompleted">Compra confirmada</span>
        <span v-else-if="hasTimedOut">Reserva expirada</span>
        <span v-else>En tràmit</span>
      </span>
    </div>

    <div
      v-if="globalError && !isCompleted"
      class="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      {{ globalError }}
    </div>

    <div
      class="grid gap-6 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-start"
    >
      <form class="space-y-4" @submit.prevent="handleConfirm">
        <h2 class="text-lg font-semibold text-slate-50">
          Dades de la persona compradora
        </h2>

        <FormField :label="'Nom'" :error="formErrors.name">
          <BaseInput
            v-model="form.name"
            :disabled="!canInteract"
            autocomplete="name"
          />
        </FormField>

        <FormField :label="'Cognoms'" :error="formErrors.surname">
          <BaseInput
            v-model="form.surname"
            :disabled="!canInteract"
            autocomplete="family-name"
          />
        </FormField>

        <FormField :label="'Correu electrònic'" :error="formErrors.email">
          <BaseInput
            v-model="form.email"
            type="email"
            :disabled="!canInteract"
            autocomplete="email"
          />
        </FormField>

        <h2 class="pt-4 text-lg font-semibold text-slate-50">
          Dades de la targeta (simulació)
        </h2>

        <FormField :label="'Número de targeta'" :error="formErrors.cardNumber">
          <BaseInput
            v-model="form.cardNumber"
            inputmode="numeric"
            autocomplete="cc-number"
            placeholder="1234 5678 9012 3456"
            :disabled="!canInteract"
          />
        </FormField>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            :label="'Caducitat (MM/AA)'"
            :error="formErrors.cardExpiry"
          >
            <BaseInput
              v-model="form.cardExpiry"
              placeholder="12/28"
              :disabled="!canInteract"
            />
          </FormField>

          <FormField :label="'CVV'" :error="formErrors.cardCvv">
            <BaseInput
              v-model="form.cardCvv"
              inputmode="numeric"
              maxlength="4"
              :disabled="!canInteract"
            />
          </FormField>
        </div>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <BaseButton
            type="submit"
            :disabled="!canInteract"
            class="w-full sm:w-auto"
          >
            <span v-if="isSubmitting">Processant...</span>
            <span v-else>Confirmar compra</span>
          </BaseButton>

          <BaseButton
            type="button"
            variant="secondary"
            class="w-full sm:w-auto"
            :disabled="!canInteract"
            @click="handleCancelClick"
          >
            <span v-if="isCancelling">Cancel·lant...</span>
            <span v-else>Cancelar i tornar enrere</span>
          </BaseButton>
        </div>

        <p class="mt-2 text-xs text-slate-400">
          Aquesta és una simulació de pagament: no s'efectuarà cap càrrec real.
          Només es valida que les dades tinguin un format raonable.
        </p>
      </form>

      <aside
        class="space-y-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-100"
      >
        <h2 class="text-base font-semibold text-slate-50">
          Resum de la compra
        </h2>
        <p class="text-slate-300">
          Estàs completant la compra de les entrades seleccionades a la vista
          anterior. Si no acabes el procés en menys de 3 minuts, la reserva de
          seients es cancel·larà automàticament.
        </p>
      </aside>
    </div>

    <SuccessModal
      :visible="isResultModalOpen"
      :type="resultModalType"
      :message="resultModalMessage"
      @close="handleResultModalClose"
    />
  </section>
</template>
