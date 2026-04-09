<script setup>
import OrderSummaryPanel from "~/shared/organisms/OrderSummaryPanel.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "go-to-checkout"]);
</script>

<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-slate-950/70 md:hidden"
      @click.self="emit('close')"
    >
      <transition name="slide-left">
        <div
          class="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-slate-900/95 p-4 shadow-2xl"
        >
          <div class="mb-2 flex items-center justify-between text-xs text-slate-300">
            <span class="font-semibold uppercase tracking-wide">Resum del pedido</span>
            <button
              type="button"
              class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-100"
              @click="emit('close')"
            >
              Tancar
            </button>
          </div>

          <OrderSummaryPanel
            class="mt-1 flex-1 overflow-y-auto"
            @close="emit('close')"
            @go-to-checkout="emit('go-to-checkout')"
          />
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.15s ease-out;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}
</style>
