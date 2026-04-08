import { defineStore } from "pinia";

export const useBookingStore = defineStore("booking", {
  state: () => ({
    selectedEvent: null,
  }),
  getters: {
    // !! fa que en cas de ser null or undefined, torni false
    hasSelectedEvent: (state) => !!state.selectedEvent,
  },
  actions: {
    setSelectedEvent(event) {
      this.selectedEvent = event;
    },
    clearSelectedEvent() {
      this.selectedEvent = null;
    },
  },
});
