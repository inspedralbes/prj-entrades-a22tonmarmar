import { mount } from "@vue/test-utils";
import OrderSummaryPanel from "@/shared/organisms/OrderSummaryPanel.vue";

jest.mock("@/stores/useBookingStore", () => ({
  useBookingStore: jest.fn(() => ({
    selection: { barricada: 1, pista: 2, butaca: ["A-1"] },
    selectedEvent: {
      tiquet: { preu_base: 25, preu_barricada: 50, preu_butaca: 35 },
    },
    totalSelected: 4,
    barricadaState: "available",
    pistaState: "available",
    canAddBarricada: true,
    canAddPista: true,
    canRemoveBarricada: true,
    canRemovePista: true,
    incrementBarricada: jest.fn(),
    decrementBarricada: jest.fn(),
    incrementPista: jest.fn(),
    decrementPista: jest.fn(),
    toggleSeat: jest.fn(),
  })),
}));

describe("OrderSummaryPanel", () => {
  it("renders summary panel", () => {
    const wrapper = mount(OrderSummaryPanel);
    expect(wrapper.text()).toContain("Resum");
  });

  it("shows selected tickets count", () => {
    const wrapper = mount(OrderSummaryPanel);
    expect(wrapper.text()).toContain("4");
  });

  it("shows max tickets limit", () => {
    const wrapper = mount(OrderSummaryPanel);
    expect(wrapper.text()).toContain("6");
  });

  it("shows ticket type labels", () => {
    const wrapper = mount(OrderSummaryPanel);
    expect(wrapper.text()).toContain("Barricada");
    expect(wrapper.text()).toContain("Pista");
  });

  it("shows checkout button", () => {
    const wrapper = mount(OrderSummaryPanel);
    expect(wrapper.text()).toContain("Ir a compra");
  });

  it("shows hide button", () => {
    const wrapper = mount(OrderSummaryPanel);
    expect(wrapper.text()).toContain("Ocultar");
  });

  it("emits close when hide button is clicked", async () => {
    const wrapper = mount(OrderSummaryPanel);
    await wrapper.findAll("button").at(0)?.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits go-to-checkout when checkout button is clicked", async () => {
    const wrapper = mount(OrderSummaryPanel);
    await wrapper.findAll("button").at(1)?.trigger("click");
    expect(wrapper.emitted("go-to-checkout")).toBeTruthy();
  });

  it("shows loading state when loading prop is true", () => {
    const wrapper = mount(OrderSummaryPanel, {
      props: { loading: true },
    });
    expect(wrapper.text()).toContain("Procesando");
  });
});