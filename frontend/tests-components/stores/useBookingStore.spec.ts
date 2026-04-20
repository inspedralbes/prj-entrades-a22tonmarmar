import { setActivePinia, createPinia } from "pinia";
import { useBookingStore } from "@/stores/useBookingStore";

describe("useBookingStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with empty state", () => {
    const store = useBookingStore();
    expect(store.selectedEvent).toBeNull();
    expect(store.totalSelected).toBe(0);
    expect(store.selection).toEqual({
      barricada: 0,
      pista: 0,
      butaca: [],
    });
  });

  it("sets selected event", () => {
    const store = useBookingStore();
    const event = { id: 1, nom: "Test Event" };
    store.setSelectedEvent(event);
    expect(store.selectedEvent).toEqual(event);
  });

  it("clears selected event", () => {
    const store = useBookingStore();
    store.setSelectedEvent({ id: 1, nom: "Test Event" });
    store.clearSelectedEvent();
    expect(store.selectedEvent).toBeNull();
  });

  it("sets availability", () => {
    const store = useBookingStore();
    store.setAvailability({
      barricada: 10,
      pista: 20,
      butaca: [
        { value: "A-1", state: "Disponible" },
        { value: "A-2", state: "Disponible" },
      ],
    });
    expect(store.availability.barricada).toBe(10);
    expect(store.availability.pista).toBe(20);
    expect(store.availability.butaca).toHaveLength(2);
  });

  it("increments barricada", () => {
    const store = useBookingStore();
    store.setAvailability({ barricada: 10, pista: 10, butaca: [] });
    store.incrementBarricada();
    expect(store.selection.barricada).toBe(1);
  });

  it("decrements barricada", () => {
    const store = useBookingStore();
    store.setAvailability({ barricada: 10, pista: 10, butaca: [] });
    store.selection.barricada = 1;
    store.decrementBarricada();
    expect(store.selection.barricada).toBe(0);
  });

  it("increments pista", () => {
    const store = useBookingStore();
    store.setAvailability({ barricada: 10, pista: 10, butaca: [] });
    store.incrementPista();
    expect(store.selection.pista).toBe(1);
  });

  it("decrements pista", () => {
    const store = useBookingStore();
    store.setAvailability({ barricada: 10, pista: 10, butaca: [] });
    store.selection.pista = 1;
    store.decrementPista();
    expect(store.selection.pista).toBe(0);
  });

  it("toggles seat", () => {
    const store = useBookingStore();
    store.setAvailability({
      barricada: 0,
      pista: 0,
      butaca: [
        { value: "A-1", state: "Disponible" },
      ],
    });
    store.toggleSeat("A-1");
    expect(store.selection.butaca).toContain("A-1");
  });

  it("removes seat when toggled again", () => {
    const store = useBookingStore();
    store.setAvailability({
      barricada: 0,
      pista: 0,
      butaca: [
        { value: "A-1", state: "Disponible" },
      ],
    });
    store.toggleSeat("A-1");
    store.toggleSeat("A-1");
    expect(store.selection.butaca).not.toContain("A-1");
  });

  it("resets selection", () => {
    const store = useBookingStore();
    store.selection = { barricada: 2, pista: 3, butaca: ["A-1", "A-2"] };
    store.resetSelection();
    expect(store.selection).toEqual({
      barricada: 0,
      pista: 0,
      butaca: [],
    });
  });

  it("calculates total correctly", () => {
    const store = useBookingStore();
    store.selection = { barricada: 2, pista: 3, butaca: ["A-1", "A-2"] };
    expect(store.totalSelected).toBe(7);
  });

  it("hasSelectedEvent returns false when no event", () => {
    const store = useBookingStore();
    expect(store.hasSelectedEvent).toBe(false);
  });

  it("hasSelectedEvent returns true when event is set", () => {
    const store = useBookingStore();
    store.setSelectedEvent({ id: 1, nom: "Test" });
    expect(store.hasSelectedEvent).toBe(true);
  });

  it("respects max 6 tickets limit", () => {
    const store = useBookingStore();
    store.setAvailability({ barricada: 10, pista: 10, butaca: [] });
    for (let i = 0; i < 10; i++) {
      store.incrementBarricada();
    }
    expect(store.totalSelected).toBeLessThanOrEqual(6);
  });

  it("canAddBarricada returns false when at limit", () => {
    const store = useBookingStore();
    store.setAvailability({ barricada: 10, pista: 10, butaca: [] });
    store.selection = { barricada: 3, pista: 3, butaca: [] };
    expect(store.canAddBarricada).toBe(false);
  });

  it("canRemoveBarricada returns false when none selected", () => {
    const store = useBookingStore();
    store.setAvailability({ barricada: 10, pista: 10, butaca: [] });
    expect(store.canRemoveBarricada).toBe(false);
  });

  it("sets and clears completed order", () => {
    const store = useBookingStore();
    const order = { id: 1, tiquets: [], total: 100 };
    store.setCompletedOrder(order);
    expect(store.completedOrder).toEqual(order);
    store.clearCompletedOrder();
    expect(store.completedOrder).toBeNull();
  });
});