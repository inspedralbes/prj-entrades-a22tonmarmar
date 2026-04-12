import { mount } from "@vue/test-utils";
import CheckoutPanel from "@/shared/organisms/CheckoutPanel.vue";

// Test bàsic de CheckoutPanel

describe("CheckoutPanel", () => {
  it("mostra el resum de la compra", () => {
    const wrapper = mount(CheckoutPanel, {
      props: { total: 42 },
    });
    expect(wrapper.text()).toContain("42");
  });

  // Arrange: simular click a confirmar compra
  it("emeteix event de confirmació quan es fa click", async () => {
    const wrapper = mount(CheckoutPanel, {
      props: { total: 42 },
    });
    await wrapper.find("button.confirm").trigger("click");
    expect(wrapper.emitted("confirm")).toBeTruthy();
  });
});
