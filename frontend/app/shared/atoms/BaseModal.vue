<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="props.visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div
          class="relative mx-4 w-full max-w-2xl rounded-lg border border-pink-700/40 bg-slate-900/95 p-6 shadow-2xl"
        >
          <header class="mb-4 flex items-center justify-between gap-4">
            <slot name="header" />
          </header>
          <section class="mb-6">
            <slot />
          </section>
          <footer class="flex items-center justify-end gap-3">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
