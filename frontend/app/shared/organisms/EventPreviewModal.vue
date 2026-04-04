<script setup>
import { computed } from "vue";
import BaseModal from "@/shared/atoms/BaseModal.vue";
import BaseButton from "@/shared/atoms/BaseButton.vue";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";
import { formatEventDate } from "@/mappers/dateMapper";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const imageSrc = computed(() => {
  if (!props.event?.imatge) return "";
  const value = String(props.event.imatge);
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `http://localhost:8000${value.startsWith("/") ? "" : "/"}${value}`;
});
</script>

<template>
  <BaseModal :visible="visible" @close="emit('close')">
    <template #header>
      <div class="flex flex-col gap-1">
        <BaseHeading :level="2">
          {{ event.nom }}
        </BaseHeading>
        <span v-if="event.artista" class="text-sm text-pink-200">
          {{ event.artista }}
        </span>
      </div>
    </template>

    <div class="grid gap-6 md:grid-cols-[2fr,1.5fr]">
      <div class="space-y-3 text-sm text-slate-100">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span
            v-if="event.data"
            class="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200"
          >
            {{ formatEventDate(event.data) }}
          </span>
          <span
            v-if="event.apertures_portes"
            class="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200"
          >
            Portes: {{ event.apertures_portes }}
          </span>
          <span
            v-if="event.hora_inici"
            class="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200"
          >
            Inici: {{ event.hora_inici }}
          </span>
          <span
            v-if="event.sold_out"
            class="rounded-full bg-pink-700 px-2 py-0.5 text-[11px] font-semibold text-white"
          >
            SOLD OUT
          </span>
        </div>

        <p v-if="event.descripcio" class="whitespace-pre-line text-sm text-slate-100">
          {{ event.descripcio }}
        </p>

        <div v-if="event.tiquet" class="mt-2 space-y-1 text-xs text-slate-200">
          <div v-if="event.tiquet.preu_base != null">
            Preu general: {{ event.tiquet.preu_base }} &euro;
          </div>
          <div v-if="event.tiquet.preu_barricada != null">
            Preu barricada: {{ event.tiquet.preu_barricada }} &euro;
          </div>
          <div v-if="event.tiquet.preu_butaca != null">
            Preu butaca: {{ event.tiquet.preu_butaca }} &euro;
          </div>
        </div>
      </div>

      <div v-if="event.imatge" class="flex items-center justify-center">
        <img
          :src="imageSrc"
          alt="Cartell de l'esdeveniment"
          class="max-h-72 w-full max-w-xs rounded-lg border border-slate-700 object-cover shadow-lg"
        />
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">
        Tancar
      </BaseButton>
    </template>
  </BaseModal>
</template>
