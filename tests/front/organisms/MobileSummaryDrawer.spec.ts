import { mount } from "@vue/test-utils";
import MobileSummaryDrawer from "@/shared/organisms/MobileSummaryDrawer.vue";

describe("MobileSummaryDrawer", () => {
  it("mostra el resum al drawer", () => {
    const wrapper = mount(MobileSummaryDrawer, {
      props: { visible: true, summary: "Resum de prova" },
    });
    expect(wrapper.text()).toContain("Resum de prova");
  });

  it("emeteix event de tancar", async () => {
    const wrapper = mount(MobileSummaryDrawer, {
      props: { visible: true, summary: "Resum de prova" },
    });
    await wrapper.find("button.close").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
