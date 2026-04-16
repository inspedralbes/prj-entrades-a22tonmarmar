<script setup>
import LegendItem from "~/shared/molecules/LegendItem.vue";
</script>

<template>
  <aside
    class="inline-flex flex-col rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 text-xs max-w-[180px]"
  >
    <h2
      class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400"
    >
      Leyenda
    </h2>
    <div class="space-y-1.5">
      <LegendItem state="available" label="disponible" />
      <LegendItem state="onHold" label="reservado" />
      <LegendItem state="selected" label="seleccionado" />
      <LegendItem state="sold" label="no disponible" />
    </div>
  </aside>
</template>
