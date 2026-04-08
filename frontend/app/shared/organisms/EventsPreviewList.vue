<script setup>
import { computed } from "vue";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";
import EventPreviewCard from "@/shared/molecules/EventPreviewCard.vue";
import { toDateInputValue } from "~/services/mappers/dateMapper";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [String, Object, null],
    default: null,
  },
});

const emit = defineEmits(["select"]);

const formatDateLabel = (rawDate) => {
  const value = toDateInputValue(rawDate);
  if (!value) return "Sense data";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
};

const groupedEvents = computed(() => {
  const map = new Map();

  for (const event of props.events || []) {
    const key = toDateInputValue(event.data) || "sense-data";
    if (!map.has(key)) {
      map.set(key, {
        key,
        label:
          key === "sense-data" ? "Sense data" : formatDateLabel(event.data),
        events: [],
      });
    }
    map.get(key).events.push(event);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.key === "sense-data") return 1;
    if (b.key === "sense-data") return -1;
    return a.key.localeCompare(b.key);
  });
});

const normalizedError = computed(() => {
  if (!props.error) return null;
  if (typeof props.error === "string") return props.error;
  return props.error?.message || "No s'han pogut carregar els esdeveniments.";
});
</script>

<template>
  <section class="h-full py-4 text-slate-100">
    <div class="mx-auto flex h-full max-w-5xl flex-col gap-4 px-3 sm:px-4">
      <header class="flex flex-col gap-2">
        <BaseHeading :level="1">Pròxims concerts</BaseHeading>
      </header>

      <main
        class="flex-1 rounded-lg border border-pink-700/30 bg-slate-900/80 p-3 sm:p-4 shadow-xl"
      >
        <div v-if="loading" class="py-10 text-center text-sm text-slate-400">
          Carregant esdeveniments...
        </div>

        <div
          v-else-if="normalizedError"
          class="py-10 text-center text-sm text-red-400"
        >
          {{ normalizedError }}
        </div>

        <div
          v-else-if="!events || events.length === 0"
          class="py-10 text-center text-sm text-slate-400"
        >
          Encara no hi ha esdeveniments disponibles.
        </div>

        <div v-else class="space-y-8 overflow-y-auto pr-1 sm:pr-2">
          <section
            v-for="group in groupedEvents"
            :key="group.key"
            class="space-y-3"
          >
            <h2 class="text-lg font-bold text-pink-300">
              {{ group.label }}
            </h2>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <EventPreviewCard
                v-for="event in group.events"
                :key="event.id"
                :event="event"
                @select="emit('select', event)"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  </section>
</template>
