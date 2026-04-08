<script setup>
import { computed } from "vue";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";
import { formatEventDate } from "~/services/mappers/dateMapper";

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select"]);

const imageSrc = computed(() => {
  if (!props.event?.imatge) return "";
  const value = String(props.event.imatge);
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `http://localhost:8000${value.startsWith("/") ? "" : "/"}${value}`;
});

const formattedDate = computed(() =>
  props.event?.data ? formatEventDate(props.event.data) : "",
);
</script>

<template>
  <article
    class="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg transition hover:border-pink-600/70 hover:bg-slate-900"
    @click="emit('select', event)"
  >
    <div class="flex flex-col gap-3 md:flex-row">
      <div v-if="event.imatge" class="md:w-1/3">
        <img
          :src="imageSrc"
          alt="Cartell de l'esdeveniment"
          class="h-40 w-full object-cover md:h-full"
        />
      </div>

      <div class="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <header class="space-y-1">
          <BaseHeading :level="3" class="text-lg font-semibold">
            {{ event.nom }}
          </BaseHeading>
          <p v-if="event.artista" class="text-sm text-pink-200">
            {{ event.artista }}
          </p>
        </header>

        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span
            v-if="event.data"
            class="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200"
          >
            {{ formattedDate }}
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

        <p v-if="event.descripcio" class="mt-1 text-sm text-slate-100">
          {{ event.descripcio }}
        </p>
      </div>
    </div>
  </article>
</template>
