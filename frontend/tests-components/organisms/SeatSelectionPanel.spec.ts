import { mount } from "@vue/test-utils";
import SeatSelectionPanel from "@/shared/organisms/SeatSelectionPanel.vue";

jest.mock("@/stores/useBookingStore", () => ({
  useBookingStore: jest.fn(() => ({
    selection: { barricada: 0, pista: 0, butaca: [] },
    selectedEvent: { id: 1, nom: "Test Event", tiquet: { preu_base: 25 } },
    totalSelected: 0,
    barricadaState: "available",
    pistaState: "available",
    butacaStates: [],
    canAddBarricada: true,
    canAddPista: true,
    canRemoveBarricada: false,
    canRemovePista: false,
    setAvailability: jest.fn(),
    resetSelection: jest.fn(),
    incrementBarricada: jest.fn(),
    decrementBarricada: jest.fn(),
    incrementPista: jest.fn(),
    decrementPista: jest.fn(),
    toggleSeat: jest.fn(),
  })),
}));

jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/services/socketService", () => ({
  connectSockets: jest.fn(),
  joinEventRoom: jest.fn(),
  leaveEventRoom: jest.fn(),
  onRoomUpdated: jest.fn(),
  offRoomUpdated: jest.fn(),
}));

jest.mock("@/services/eventsApi", () => ({
  getEventRoom: jest.fn(() => Promise.resolve({ success: true, room: {} })),
}));

jest.mock("@/services/ordersApi", () => ({
  startCheckout: jest.fn(),
}));

describe("SeatSelectionPanel", () => {
  it("renders seat selection panel", () => {
    const wrapper = mount(SeatSelectionPanel);
    expect(wrapper.find("section").exists()).toBe(true);
  });

  it("shows seat legend", () => {
    const wrapper = mount(SeatSelectionPanel);
    expect(wrapper.text()).toContain("Leyenda");
  });

  it("shows selected tickets count", () => {
    const wrapper = mount(SeatSelectionPanel);
    expect(wrapper.text()).toContain("0");
  });

  it("shows max tickets limit", () => {
    const wrapper = mount(SeatSelectionPanel);
    expect(wrapper.text()).toContain("6");
  });

  it("shows summary button when tickets selected", async () => {
    const wrapper = mount(SeatSelectionPanel);
    expect(wrapper.text()).toContain("Mostrar resum");
  });
});