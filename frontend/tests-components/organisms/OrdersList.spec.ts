import { mount } from "@vue/test-utils";
import OrdersList from "@/shared/organisms/OrdersList.vue";

describe("OrdersList", () => {
  const mockOrders = [
    {
      id: 1,
      email: "test1@test.com",
      created_at: "2026-04-20T10:00:00Z",
      num_tiquets: 2,
      tiquets: [
        { type: "general", price: 25 },
        { type: "barricada", price: 50 },
      ],
    },
    {
      id: 2,
      email: "test2@test.com",
      created_at: "2026-04-20T11:00:00Z",
      num_tiquets: 1,
      tiquets: [{ type: "butaca", butaca: "A-1", price: 35 }],
    },
  ];

  it("renders orders list", () => {
    const wrapper = mount(OrdersList, {
      props: { orders: mockOrders },
    });
    expect(wrapper.text()).toContain("test1@test.com");
    expect(wrapper.text()).toContain("test2@test.com");
  });

  it("shows header title", () => {
    const wrapper = mount(OrdersList, {
      props: { orders: mockOrders },
    });
    expect(wrapper.text()).toContain("Comandes");
  });

  it("shows loading state when loading prop is true", () => {
    const wrapper = mount(OrdersList, {
      props: { orders: [], loading: true },
    });
    expect(wrapper.text()).toContain("Carregant");
  });

  it("shows empty state when no orders", () => {
    const wrapper = mount(OrdersList, {
      props: { orders: [] },
    });
    expect(wrapper.text()).toContain("Encara no");
  });

  it("shows error state when error prop is provided", () => {
    const wrapper = mount(OrdersList, {
      props: { orders: [], error: "Error de carrega" },
    });
    expect(wrapper.text()).toContain("Error");
  });

  it("shows order tickets count", () => {
    const wrapper = mount(OrdersList, {
      props: { orders: mockOrders },
    });
    expect(wrapper.text()).toContain("tiquets");
  });

  it("toggles order expansion on click", async () => {
    const wrapper = mount(OrdersList, {
      props: { orders: mockOrders },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Detall del tiquet");
  });
});