import { mount } from "@vue/test-utils";
import EventFormModal from "@/shared/organisms/EventFormModal.vue";

// Test bàsic d'EventFormModal

describe("EventFormModal", () => {
  it("mostra el formulari de creació d'event", () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true },
    });
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("emeteix event de creació amb dades vàlides", async () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true },
    });
    await wrapper.find("input[name=name]").setValue("Concert nou");
    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.emitted("create")).toBeTruthy();
  });
});
