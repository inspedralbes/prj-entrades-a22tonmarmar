import { mount } from "@vue/test-utils";
import OrderSummaryPanel from "@/shared/organisms/OrderSummaryPanel.vue";

describe("OrderSummaryPanel", () => {
  it("mostra el resum de la comanda", () => {
    const wrapper = mount(OrderSummaryPanel, {
      props: { order: { code: "ORD-1", total: 50 } },
    });
    expect(wrapper.text()).toContain("ORD-1");
    expect(wrapper.text()).toContain("50");
  });
});
