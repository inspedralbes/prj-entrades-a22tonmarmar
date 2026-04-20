import { mount } from "@vue/test-utils";
import { jest } from "@vue/vue3-jest";
import CheckoutPanel from "@/shared/organisms/CheckoutPanel.vue";

jest.mock("@/stores/useBookingStore", () => ({
  useBookingStore: jest.fn(() => ({
    selectedEvent: { id: 1, nom: "Test Event", artista: "Test Artist" },
    hasSelectedEvent: true,
    setCompletedOrder: jest.fn(),
  })),
}));

jest.mock("vue-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
  useRoute: () => ({
    query: { orderId: "123" },
    params: {},
  }),
}));

describe("CheckoutPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders checkout form", () => {
    const wrapper = mount(CheckoutPanel);
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("shows event name in header", () => {
    const wrapper = mount(CheckoutPanel);
    expect(wrapper.text()).toContain("Test Event");
  });

  it("shows form fields", () => {
    const wrapper = mount(CheckoutPanel);
    expect(wrapper.text()).toContain("Nom");
    expect(wrapper.text()).toContain("Correu");
    expect(wrapper.text()).toContain(" targeta");
  });

  it("shows timer countdown", () => {
    const wrapper = mount(CheckoutPanel);
    expect(wrapper.text()).toContain("Temps restant");
  });

  it("shows submit button", () => {
    const wrapper = mount(CheckoutPanel);
    expect(wrapper.text()).toContain("Confirmar compra");
  });

  it("shows cancel button", () => {
    const wrapper = mount(CheckoutPanel);
    expect(wrapper.text()).toContain("Cancelar");
  });
});
