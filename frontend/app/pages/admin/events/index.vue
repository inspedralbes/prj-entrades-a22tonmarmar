<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import EventsList from "@/shared/organisms/EventsList.vue";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/services/eventsApi";
import { updateTiquet } from "@/services/tiquetsApi";
import EventFormModal from "@/shared/organisms/EventFormModal.vue";
import SuccessModal from "@/shared/organisms/SuccessModal.vue";
import ConfirmDeleteModal from "@/shared/organisms/ConfirmDeleteModal.vue";
import EventPreviewModal from "@/shared/organisms/EventPreviewModal.vue";
import AdminLayout from "@/pages/admin/layout.vue";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();

const events = ref([]);
const loadingList = ref(false);
const listError = ref(null);

const isCreateOpen = ref(false);
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);
const isPreviewOpen = ref(false);

const selectedEvent = ref(null);
const eventToDelete = ref(null);

const saving = ref(false);
const deleting = ref(false);
const formErrors = ref({});

const isSuccessOpen = ref(false);
const successMessage = ref("");

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

const handlePreviewRequest = (event) => {
  selectedEvent.value = event;
  isPreviewOpen.value = true;
};

const handleEditRequest = (event) => {
  openEdit(event);
};

const handleOrdersRequest = (event) => {
  if (!event || !event.id) return;
  router.push(`/admin/events/order/${event.id}`);
};

const handleDeleteRequest = (event) => {
  eventToDelete.value = event;
  isDeleteOpen.value = true;
};

const buildEmptyEvent = () => ({
  id: null,
  nom: "",
  artista: "",
  data: "",
  apertures_portes: "",
  hora_inici: "",
  descripcio: "",
  imatge: "",
  sold_out: false,
  tiquet: {
    id: null,
    preu_base: "",
    preu_barricada: "",
    preu_butaca: "",
  },
});

const openCreate = () => {
  selectedEvent.value = buildEmptyEvent();
  formErrors.value = {};
  isCreateOpen.value = true;
};

const openEdit = (event) => {
  selectedEvent.value = JSON.parse(JSON.stringify(event));
  formErrors.value = {};
  isEditOpen.value = true;
};

const handleCreateRequest = () => {
  openCreate();
};

const openSuccess = (message) => {
  successMessage.value = message;
  isSuccessOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (!eventToDelete.value || !eventToDelete.value.id) {
    isDeleteOpen.value = false;
    return;
  }

  deleting.value = true;

  try {
    await deleteEvent(eventToDelete.value.id);
    events.value = events.value.filter(
      (ev) => ev.id !== eventToDelete.value.id,
    );
    isDeleteOpen.value = false;
    eventToDelete.value = null;
    openSuccess("Esdeveniment eliminat correctament.");
  } catch (error) {
    listError.value =
      error?.message || "No s'ha pogut eliminar l'esdeveniment.";
  } finally {
    deleting.value = false;
  }
};

const handleFormSubmit = async (updatedEvent, localValidationErrors, mode) => {
  if (localValidationErrors && Object.keys(localValidationErrors).length > 0) {
    formErrors.value = localValidationErrors;
    return;
  }

  saving.value = true;
  formErrors.value = {};

  const numeric = {
    preu_base: Number(updatedEvent.tiquet.preu_base),
    preu_barricada:
      updatedEvent.tiquet.preu_barricada !== "" &&
      updatedEvent.tiquet.preu_barricada !== null
        ? Number(updatedEvent.tiquet.preu_barricada)
        : null,
    preu_butaca:
      updatedEvent.tiquet.preu_butaca !== "" &&
      updatedEvent.tiquet.preu_butaca !== null
        ? Number(updatedEvent.tiquet.preu_butaca)
        : null,
  };

  try {
    if (mode === "create") {
      const formData = new FormData();
      formData.append("nom", updatedEvent.nom);
      if (updatedEvent.artista)
        formData.append("artista", updatedEvent.artista);
      formData.append("data", updatedEvent.data);
      if (updatedEvent.apertures_portes)
        formData.append("apertures_portes", updatedEvent.apertures_portes);
      if (updatedEvent.hora_inici)
        formData.append("hora_inici", updatedEvent.hora_inici);
      formData.append("descripcio", updatedEvent.descripcio);

      if (updatedEvent.imageFile) {
        formData.append("imatge", updatedEvent.imageFile);
      }

      formData.append("tiquet[preu_base]", String(numeric.preu_base));
      if (numeric.preu_barricada !== null)
        formData.append(
          "tiquet[preu_barricada]",
          String(numeric.preu_barricada),
        );
      if (numeric.preu_butaca !== null)
        formData.append("tiquet[preu_butaca]", String(numeric.preu_butaca));

      const created = await createEvent(formData);
      events.value = [...events.value, created];
      isCreateOpen.value = false;
      selectedEvent.value = null;
      openSuccess("Esdeveniment creat correctament.");
    } else if (mode === "edit") {
      const eventId = updatedEvent.id;

      let body;
      if (updatedEvent.imageFile) {
        const formData = new FormData();
        formData.append("nom", updatedEvent.nom);
        if (updatedEvent.artista)
          formData.append("artista", updatedEvent.artista);
        if (updatedEvent.data) formData.append("data", updatedEvent.data);
        if (updatedEvent.apertures_portes)
          formData.append("apertures_portes", updatedEvent.apertures_portes);
        if (updatedEvent.hora_inici)
          formData.append("hora_inici", updatedEvent.hora_inici);
        if (updatedEvent.descripcio)
          formData.append("descripcio", updatedEvent.descripcio);
        formData.append("imatge", updatedEvent.imageFile);
        body = formData;
      } else {
        body = {
          nom: updatedEvent.nom,
          artista: updatedEvent.artista || null,
          data: updatedEvent.data,
          apertures_portes: updatedEvent.apertures_portes || null,
          hora_inici: updatedEvent.hora_inici || null,
          descripcio: updatedEvent.descripcio,
        };
      }

      const updatedFromApi = await updateEvent(eventId, body);

      if (updatedEvent.tiquet?.id) {
        await updateTiquet(updatedEvent.tiquet.id, {
          preu_base: numeric.preu_base,
          preu_barricada: numeric.preu_barricada,
          preu_butaca: numeric.preu_butaca,
        });
      }

      events.value = events.value.map((ev) =>
        ev.id === eventId ? { ...ev, ...updatedFromApi } : ev,
      );
      isEditOpen.value = false;
      selectedEvent.value = null;
      openSuccess("Esdeveniment actualitzat correctament.");
    }
  } catch (error) {
    if (error?.details && typeof error.details === "object") {
      formErrors.value = error.details;
    } else {
      formErrors.value = { _global: error?.message || "Error en desar" };
    }
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <AdminLayout>
    <EventsList
      :events="events"
      :loading="loadingList"
      :error="listError"
      @create="handleCreateRequest"
      @preview="handlePreviewRequest"
      @edit="handleEditRequest"
      @orders="handleOrdersRequest"
      @delete="handleDeleteRequest"
    />

    <EventFormModal
      v-if="isCreateOpen"
      :visible="isCreateOpen"
      mode="create"
      :event="selectedEvent"
      :loading="saving"
      :errors="formErrors"
      @submit="
        (updated, localErrors) =>
          handleFormSubmit(updated, localErrors, 'create')
      "
      @close="isCreateOpen = false"
    />

    <EventFormModal
      v-if="isEditOpen"
      :visible="isEditOpen"
      mode="edit"
      :event="selectedEvent"
      :loading="saving"
      :errors="formErrors"
      @submit="
        (updated, localErrors) => handleFormSubmit(updated, localErrors, 'edit')
      "
      @close="isEditOpen = false"
    />

    <SuccessModal
      v-if="isSuccessOpen"
      :visible="isSuccessOpen"
      :message="successMessage"
      @close="isSuccessOpen = false"
    />

    <ConfirmDeleteModal
      v-if="isDeleteOpen && eventToDelete"
      :visible="isDeleteOpen"
      :event-name="eventToDelete?.nom ?? ''"
      :loading="deleting"
      @confirm="handleConfirmDelete"
      @cancel="isDeleteOpen = false"
    />

    <EventPreviewModal
      v-if="isPreviewOpen && selectedEvent"
      :visible="isPreviewOpen"
      :event="selectedEvent"
      @close="isPreviewOpen = false"
    />
  </AdminLayout>
</template>
