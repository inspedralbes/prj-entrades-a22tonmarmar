import { mount } from "@vue/test-utils";
import ConfirmDeleteModal from "@/shared/organisms/ConfirmDeleteModal.vue";

describe("ConfirmDeleteModal", () => {
  it("mostra el missatge de confirmació", () => {
    const wrapper = mount(ConfirmDeleteModal, {
      props: { visible: true },
    });
    expect(wrapper.text().toLowerCase()).toContain("confirmar");
  });

  it("emeteix event de confirmació quan es fa click", async () => {
    const wrapper = mount(ConfirmDeleteModal, {
      props: { visible: true },
    });
    await wrapper.find("button.confirm").trigger("click");
    expect(wrapper.emitted("confirm")).toBeTruthy();
  });
});
