import { mount } from "@vue/test-utils";
import ConfirmDeleteModal from "@/shared/organisms/ConfirmDeleteModal.vue";

describe("ConfirmDeleteModal", () => {
  it("renders modal when visible is true", () => {
    const wrapper = mount(ConfirmDeleteModal, {
      props: { visible: true },
    });
    expect(wrapper.find("modal").exists()).toBe(true);
  });

  it("shows confirmation message with event name", () => {
    const wrapper = mount(ConfirmDeleteModal, {
      props: { visible: true, eventName: "Concert Test" },
    });
    expect(wrapper.text()).toContain("Concert Test");
  });

  it("shows confirm and cancel buttons", () => {
    const wrapper = mount(ConfirmDeleteModal, {
      props: { visible: true },
    });
    expect(wrapper.text()).toContain("Eliminar");
    expect(wrapper.text()).toContain("Cancel");
  });

  it("emits confirm when confirm button is clicked", async () => {
    const wrapper = mount(ConfirmDeleteModal, {
      props: { visible: true },
    });
    await wrapper.findAll("button").at(1)?.trigger("click");
    expect(wrapper.emitted("confirm")).toBeTruthy();
  });

  it("emits cancel when cancel button is clicked", async () => {
    const wrapper = mount(ConfirmDeleteModal, {
      props: { visible: true },
    });
    await wrapper.findAll("button").at(0)?.trigger("click");
    expect(wrapper.emitted("cancel")).toBeTruthy();
  });

  it("shows loading state when loading prop is true", () => {
    const wrapper = mount(ConfirmDeleteModal, {
      props: { visible: true, loading: true },
    });
    expect(wrapper.text()).toContain("Eliminant");
  });
});