import { defineStore } from "pinia";

export const useBookingStore = defineStore("booking", {
  state: () => ({
    selectedEvent: null,
    // Disponibilitat que ve del backend (/availability)
    availability: {
      barricada: 0,
      pista: 0,
      butaca: [], // [{ value: 'A-1', state: 'Disponible' | 'En tramite' | 'Vendido' }]
    },
    // Selecció de l'usuari amb la forma del payload de comanda
    selection: {
      barricada: 0,
      pista: 0,
      butaca: [], // ['A-1', 'A-2']
    },
    // Dades de la comanda completada, per a la pantalla de confirmació
    completedOrder: null,
  }),
  getters: {
    // !! fa que en cas de ser null or undefined, torni false
    hasSelectedEvent: (state) => !!state.selectedEvent,
    totalSelected: (state) =>
      state.selection.barricada +
      state.selection.pista +
      state.selection.butaca.length,
    canAddBarricada: (state) => {
      const total =
        state.selection.barricada +
        state.selection.pista +
        state.selection.butaca.length;
      return (
        total < 6 &&
        state.availability.barricada > 0 &&
        state.selection.barricada < state.availability.barricada
      );
    },
    canAddPista: (state) => {
      const total =
        state.selection.barricada +
        state.selection.pista +
        state.selection.butaca.length;
      return (
        total < 6 &&
        state.availability.pista > 0 &&
        state.selection.pista < state.availability.pista
      );
    },
    canRemoveBarricada: (state) => state.selection.barricada > 0,
    canRemovePista: (state) => state.selection.pista > 0,
    // Estat visual per a les zones agregades a partir de la disponibilitat i la selecció
    barricadaState: (state) => {
      if (state.selection.barricada > 0) return "selected";
      if (state.availability.barricada <= 0) return "sold";
      return "available";
    },
    pistaState: (state) => {
      if (state.selection.pista > 0) return "selected";
      if (state.availability.pista <= 0) return "sold";
      return "available";
    },
    // Estat visual per a cada butaca a partir de la disponibilitat i la selecció
    butacaStates: (state) => {
      return state.availability.butaca.map((seat) => {
        const baseState = seat.state;

        // Si aquesta butaca està seleccionada a selection.butaca
        const isSelected = state.selection.butaca.includes(seat.value);
        if (isSelected) return { ...seat, uiState: "selected" };

        // Mapegem l'estat del backend a l'estat de UI
        if (baseState === "En tramite") return { ...seat, uiState: "onHold" };
        if (baseState === "Vendido") return { ...seat, uiState: "sold" };
        return { ...seat, uiState: "available" };
      });
    },
    hasCompletedOrder: (state) => !!state.completedOrder,
  },
  actions: {
    setSelectedEvent(event) {
      this.selectedEvent = event;
    },
    clearSelectedEvent() {
      this.selectedEvent = null;
      this.resetSelection();
    },
    // Disponibilitat inicial des del backend
    setAvailability(payload) {
      this.availability = {
        barricada: payload?.barricada ?? 0,
        pista: payload?.pista ?? 0,
        butaca: Array.isArray(payload?.butaca) ? payload.butaca : [],
      };
      // Ajustem la selecció existent perquè no contingui elements ja no disponibles
      this.reconcileSelectionWithAvailability();
    },
    resetSelection() {
      this.selection = {
        barricada: 0,
        pista: 0,
        butaca: [],
      };
    },
    setCompletedOrder(order) {
      this.completedOrder = order || null;
    },
    clearCompletedOrder() {
      this.completedOrder = null;
    },
    // Elimina qualsevol selecció que ja no sigui possible amb la disponibilitat actual
    reconcileSelectionWithAvailability() {
      // Zones de peu: assegurem que la selecció no superi la disponibilitat
      if (this.selection.barricada > this.availability.barricada) {
        this.selection.barricada = this.availability.barricada;
      }
      if (this.selection.pista > this.availability.pista) {
        this.selection.pista = this.availability.pista;
      }

      // Butaques: eliminem de la selecció les que ja no estiguin "Disponible"
      const availableSeatValues = this.availability.butaca
        .filter((seat) => seat.state === "Disponible")
        .map((seat) => seat.value);

      this.selection.butaca = this.selection.butaca.filter((label) =>
        availableSeatValues.includes(label),
      );

      // Clamp final de seguretat al límit global de 6 seients
      while (this.totalSelected > 6) {
        if (this.selection.butaca.length > 0) {
          this.selection.butaca.pop();
        } else if (this.selection.pista > 0) {
          this.selection.pista -= 1;
        } else if (this.selection.barricada > 0) {
          this.selection.barricada -= 1;
        } else {
          break;
        }
      }
    },
    incrementBarricada() {
      if (!this.canAddBarricada) return;
      this.selection.barricada += 1;
    },
    decrementBarricada() {
      if (!this.canRemoveBarricada) return;
      this.selection.barricada -= 1;
    },
    incrementPista() {
      if (!this.canAddPista) return;
      this.selection.pista += 1;
    },
    decrementPista() {
      if (!this.canRemovePista) return;
      this.selection.pista -= 1;
    },
    toggleZone(zone) {
      if (zone !== "barricada" && zone !== "pista") return;

      // Estat actual de la zona i disponibilitat
      const current = this.selection[zone];
      const available = this.availability[zone];

      // Si no hi ha disponibilitat, no fem res
      if (!available || available <= 0) return;

      // Si ja està seleccionada (1), la desmarquem (0)
      if (current > 0) {
        this.selection[zone] = 0;
        return;
      }

      // Si no està seleccionada, comprovem el límit global de 6
      const currentTotal = this.totalSelected;
      if (currentTotal >= 6) return;

      // Alternem de 0 -> 1
      this.selection[zone] = 1;
    },
    toggleSeat(label) {
      if (!label) return;

      // Buscar la butaca a la disponibilitat per veure el seu estat base
      const seat = this.availability.butaca.find((s) => s.value === label);
      if (!seat) return;

      // Si està en tràmit o venuda, no permetem clics
      if (seat.state === "En tramite" || seat.state === "Vendido") return;

      const index = this.selection.butaca.indexOf(label);

      // Si ja està seleccionada, la traiem (selected -> available)
      if (index !== -1) {
        this.selection.butaca.splice(index, 1);
        return;
      }

      // Si no està seleccionada, comprovem límit global de 6
      const currentTotal = this.totalSelected;
      if (currentTotal >= 6) return;

      this.selection.butaca.push(label);
    },
  },
});
