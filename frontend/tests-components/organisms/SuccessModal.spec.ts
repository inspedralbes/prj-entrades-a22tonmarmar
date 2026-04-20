import { mount } from "@vue/test-utils";
import SuccessModal from "@/shared/organisms/SuccessModal.vue";

describe("SuccessModal", () => {
  it("renders modal when visible is true", () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true, message: "Test message" },
    });
    expect(wrapper.find("modal").exists()).toBe(true);
  });

  it("shows success title by default", () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true, message: "Test message" },
    });
    expect(wrapper.text()).toContain("correcta");
  });

  it("shows error title when type is error", () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true, message: "Test error", type: "error" },
    });
    expect(wrapper.text()).toContain("problema");
  });

  it("shows custom message", () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true, message: "Custom success message" },
    });
    expect(wrapper.text()).toContain("Custom success message");
  });

  it("shows default message when no message prop provided", () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true },
    });
    expect(wrapper.text()).toContain("correcta");
  });

  it("shows close button", () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true, message: "Test" },
    });
    expect(wrapper.text()).toContain("D'acord");
  });

  it("emits close when button is clicked", async () => {
    const wrapper = mount(SuccessModal, {
      props: { visible: true, message: "Test" },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});