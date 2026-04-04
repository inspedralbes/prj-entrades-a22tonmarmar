<script setup>
import { computed, reactive, ref, watch } from "vue";
import BaseModal from "@/shared/atoms/BaseModal.vue";
import BaseButton from "@/shared/atoms/BaseButton.vue";
import BaseInput from "@/shared/atoms/BaseInput.vue";
import FormField from "@/shared/molecules/FormField.vue";
import { toDateInputValue, toTimeInputValue } from "@/mappers/dateMapper";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "create", // "create" | "edit"
  },
  event: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["close", "submit"]);

const localEvent = reactive(createLocalEvent(props.event));
const imageFile = ref(null);

watch(
  () => props.event,
  (value) => {
    Object.assign(localEvent, createLocalEvent(value));
    imageFile.value = null;
  },
  { deep: true },
);

const title = computed(() =>
  props.mode === "edit" ? "Editar esdeveniment" : "Nou esdeveniment",
);

function createLocalEvent(source = {}) {
  return {
    id: source.id ?? null,
    nom: source.nom ?? "",
    artista: source.artista ?? "",
    data: toDateInputValue(source.data ?? ""),
    apertures_portes: toTimeInputValue(source.apertures_portes ?? ""),
    hora_inici: toTimeInputValue(source.hora_inici ?? ""),
    descripcio: source.descripcio ?? "",
    imatge: source.imatge ?? "",
    tiquet: {
      id: source.tiquet?.id ?? null,
      preu_base: source.tiquet?.preu_base ?? "",
      preu_barricada: source.tiquet?.preu_barricada ?? "",
      preu_butaca: source.tiquet?.preu_butaca ?? "",
    },
  };
}

function validate() {
  const fieldErrors = {};

  if (!localEvent.nom) fieldErrors.nom = "El nom és obligatori";
  if (!localEvent.data) fieldErrors.data = "La data és obligatòria";
  if (!localEvent.descripcio)
    fieldErrors.descripcio = "La descripció és obligatòria";
  if (!localEvent.tiquet.preu_base)
    fieldErrors["tiquet.preu_base"] = "El preu base és obligatori";

  const numericFields = ["preu_base", "preu_barricada", "preu_butaca"];

  numericFields.forEach((field) => {
    const value = localEvent.tiquet[field];
    if (value === "" || value === null || value === undefined) return;
    const number = Number(value);
    if (Number.isNaN(number) || number < 0) {
      fieldErrors[`tiquet.${field}`] = "Ha de ser un número positiu";
    }
  });

  return fieldErrors;
}

function handleSubmit() {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    // Dejamos que el padre gestione si quiere combinar con errores de back
    emit(
      "submit",
      { ...localEvent, imageFile: imageFile.value },
      validationErrors,
    );
    return;
  }
  emit("submit", { ...localEvent, imageFile: imageFile.value }, null);
}

function handleImageChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  imageFile.value = file;
}
</script>

<template>
  <BaseModal :visible="visible" @close="emit('close')">
    <template #header>
      <h2 class="text-lg font-semibold text-pink-300">
        {{ title }}
      </h2>
    </template>

    <div class="space-y-4 text-sm">
      <div class="grid gap-4 md:grid-cols-2">
        <FormField :label="'Nom'" :error="errors.nom">
          <BaseInput
            v-model="localEvent.nom"
            placeholder="Nom de l'esdeveniment"
          />
        </FormField>

        <FormField :label="'Artista'" :error="errors.artista">
          <BaseInput
            v-model="localEvent.artista"
            placeholder="Nom de l'artista"
          />
        </FormField>

        <FormField :label="'Data'" :error="errors.data">
          <BaseInput v-model="localEvent.data" type="date" />
        </FormField>

        <FormField :label="'Apertura portes'" :error="errors.apertures_portes">
          <BaseInput v-model="localEvent.apertures_portes" type="time" />
        </FormField>

        <FormField :label="'Hora inici'" :error="errors.hora_inici">
          <BaseInput v-model="localEvent.hora_inici" type="time" />
        </FormField>

        <FormField :label="'Imatge'" :error="errors.imatge">
          <div class="space-y-2">
            <input
              type="file"
              accept="image/*"
              class="block w-full text-xs text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-pink-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-pink-700"
              @change="handleImageChange"
            />
            <BaseInput
              v-if="localEvent.imatge"
              v-model="localEvent.imatge"
              readonly
            />
          </div>
        </FormField>
      </div>

      <FormField :label="'Descripció'" :error="errors.descripcio">
        <textarea
          v-model="localEvent.descripcio"
          rows="4"
          class="w-full rounded-md border border-pink-700/40 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 shadow-sm outline-none ring-pink-400 focus:border-pink-400 focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950"
        ></textarea>
      </FormField>

      <div
        class="mt-4 rounded-lg border border-pink-700/40 bg-slate-950/60 p-4"
      >
        <h3 class="mb-3 text-sm font-semibold text-pink-300">Preus tiquet</h3>
        <div class="grid gap-4 md:grid-cols-3">
          <FormField :label="'Preu base'" :error="errors['tiquet.preu_base']">
            <BaseInput
              v-model="localEvent.tiquet.preu_base"
              type="number"
              min="0"
              step="0.01"
            />
          </FormField>
          <FormField
            :label="'Preu barricada'"
            :error="errors['tiquet.preu_barricada']"
          >
            <BaseInput
              v-model="localEvent.tiquet.preu_barricada"
              type="number"
              min="0"
              step="0.01"
            />
          </FormField>
          <FormField
            :label="'Preu butaca'"
            :error="errors['tiquet.preu_butaca']"
          >
            <BaseInput
              v-model="localEvent.tiquet.preu_butaca"
              type="number"
              min="0"
              step="0.01"
            />
          </FormField>
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton
        variant="secondary"
        :disabled="loading"
        @click="emit('close')"
      >
        Cancel·lar
      </BaseButton>
      <BaseButton :disabled="loading" @click="handleSubmit">
        {{ loading ? "Guardant..." : "Guardar" }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
