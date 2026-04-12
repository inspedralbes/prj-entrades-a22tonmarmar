import { mount } from "@vue/test-utils";
import OrdersList from "@/shared/organisms/OrdersList.vue";

describe("OrdersList", () => {
  it("mostra una llista de comandes", () => {
    const orders = [
      { id: 1, code: "ORD-1" },
      { id: 2, code: "ORD-2" },
    ];
    const wrapper = mount(OrdersList, {
      props: { orders },
    });
    expect(wrapper.text()).toContain("ORD-1");
    expect(wrapper.text()).toContain("ORD-2");
  });

  it("emeteix event quan es selecciona una comanda", async () => {
    const orders = [{ id: 1, code: "ORD-1" }];
    const wrapper = mount(OrdersList, {
      props: { orders },
    });
    await wrapper.find("li").trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
  });
});
