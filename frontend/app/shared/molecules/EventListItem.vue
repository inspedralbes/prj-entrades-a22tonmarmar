<script setup>
import BaseButton from "@/shared/atoms/BaseButton.vue";
import BaseHeading from "@/shared/atoms/BaseHeading.vue";
import { formatEventDate } from "@/mappers/dateMapper";

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["preview", "edit", "delete", "orders"]);
</script>

<template>
  <article
    class="flex flex-col gap-3 rounded-md border border-slate-700/60 bg-slate-900 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-500/70 hover:shadow-lg"
  >
    <div class="min-w-0 flex-1">
      <BaseHeading :level="3" class="truncate text-pink-200">
        {{ event.nom }}
      </BaseHeading>
      <div
        class="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400"
      >
        <span v-if="event.artista" class="truncate">
          {{ event.artista }}
        </span>
        <span
          v-if="event.data"
          class="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200"
        >
          {{ formatEventDate(event.data) }}
        </span>
        <span
          v-if="event.sold_out"
          class="rounded-full bg-pink-700 px-2 py-0.5 text-[11px] font-semibold text-white"
        >
          SOLD OUT
        </span>
      </div>
    </div>

    <div class="flex flex-shrink-0 items-center gap-2 self-start sm:self-auto">
      <BaseButton variant="secondary" @click="emit('preview')">
        <Icon name="heroicons-outline:eye" class="h-4 w-4" />
      </BaseButton>
      <BaseButton variant="secondary" @click="emit('edit')">
        <Icon name="heroicons-outline:pencil-square" class="h-4 w-4" />
      </BaseButton>
      <BaseButton variant="secondary" @click="emit('orders')">
        <Icon
          name="heroicons-outline:clipboard-document-list"
          class="h-4 w-4"
        />
      </BaseButton>
      <BaseButton variant="danger" @click="emit('delete')">
        <Icon name="heroicons-outline:trash" class="h-4 w-4" />
      </BaseButton>
    </div>
  </article>
</template>
