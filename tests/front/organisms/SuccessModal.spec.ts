import { mount } from "@vue/test-utils";
import SuccessModal from "@/shared/organisms/SuccessModal.vue";

describe("SuccessModal", () => {
  it("mostra el missatge d'èxit", () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true, message: "Compra realitzada!" },
    });
    expect(wrapper.text()).toContain("Compra realitzada!");
  });

  it("emeteix event de tancar", async () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true, message: "Compra realitzada!" },
    });
    await wrapper.find("button.close").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
