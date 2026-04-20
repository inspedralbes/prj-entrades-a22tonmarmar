<script setup>
import BaseHeading from "@/shared/atoms/BaseHeading.vue";
import BaseButton from "@/shared/atoms/BaseButton.vue";
import EventListItem from "@/shared/molecules/EventListItem.vue";

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

const emit = defineEmits(["create", "preview", "edit", "delete", "orders"]);
</script>

<template>
  <section class="h-full py-2 sm:py-4 text-slate-100">
    <div
      class="mx-auto flex h-full max-w-5xl flex-col gap-4 sm:gap-6 px-3 sm:px-4"
    >
      <header
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <BaseHeading :level="1">Gestió d'esdeveniments</BaseHeading>
        <div class="flex items-center justify-start gap-2 sm:justify-end">
          <BaseButton @click="emit('create')">NOU EVENT</BaseButton>
        </div>
      </header>

      <main
        class="flex-1 rounded-lg border border-pink-700/30 bg-slate-900/80 p-3 sm:p-4 shadow-xl"
      >
        <div v-if="loading" class="py-10 text-center text-sm text-slate-400">
          Carregant esdeveniments...
        </div>

        <div v-else-if="error" class="py-10 text-center text-sm text-red-400">
          {{
            typeof error === "string"
              ? error
              : "S'ha produït un error en carregar els esdeveniments."
          }}
        </div>

        <div
          v-else-if="!props.events || props.events.length === 0"
          class="py-10 text-center text-sm text-slate-400"
        >
          Encara no hi ha esdeveniments.
        </div>

        <div v-else class="space-y-2 text-sm text-slate-100 pr-1 sm:pr-2">
          <EventListItem
            v-for="event in props.events"
            :key="event.id"
            :event="event"
            @preview="emit('preview', event)"
            @edit="emit('edit', event)"
            @orders="emit('orders', event)"
            @delete="emit('delete', event)"
          />
        </div>
      </main>
    </div>
  </section>
</template>
