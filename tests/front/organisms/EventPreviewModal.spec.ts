import { mount } from "@vue/test-utils";
import EventPreviewModal from "@/shared/organisms/EventPreviewModal.vue";

describe("EventPreviewModal", () => {
  it("mostra el modal de preview d'event", () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: { name: "Concert", date: "2026-06-01" } },
    });
    expect(wrapper.text()).toContain("Concert");
    expect(wrapper.text()).toContain("2026-06-01");
  });

  it("emeteix event de tancar quan es fa click", async () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: { name: "Concert", date: "2026-06-01" } },
    });
    await wrapper.find("button.close").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
