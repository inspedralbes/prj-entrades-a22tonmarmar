import { mount } from "@vue/test-utils";
import EventFormModal from "@/shared/organisms/EventFormModal.vue";

describe("EventFormModal", () => {
  const defaultEvent = {
    id: null,
    nom: "",
    artista: "",
    data: "",
    apertures_portes: "",
    hora_inici: "",
    descripcio: "",
    imatge: "",
    tiquet: {
      id: null,
      preu_base: "",
      preu_barricada: "",
      preu_butaca: "",
    },
  };

  it("renders modal when visible is true", () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("shows title for create mode", () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true, event: defaultEvent, mode: "create" },
    });
    expect(wrapper.text()).toContain("Nou esdeveniment");
  });

  it("shows title for edit mode", () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true, event: { ...defaultEvent, nom: "Test" }, mode: "edit" },
    });
    expect(wrapper.text()).toContain("Editar");
  });

  it("shows form fields", () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.text()).toContain("Nom");
    expect(wrapper.text()).toContain("Artista");
    expect(wrapper.text()).toContain("Data");
  });

  it("shows ticket price fields", () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.text()).toContain("Preu base");
    expect(wrapper.text()).toContain("Preu barricada");
    expect(wrapper.text()).toContain("Preu butaca");
  });

  it("shows cancel and save buttons", () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.text()).toContain("Cancel");
    expect(wrapper.text()).toContain("Guardar");
  });

  it("emits close when cancel is clicked", async () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true, event: defaultEvent },
    });
    await wrapper.findAll("button").at(0)?.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("shows loading state when loading prop is true", () => {
    const wrapper = mount(EventFormModal, {
      props: { visible: true, event: defaultEvent, loading: true },
    });
    expect(wrapper.text()).toContain("Guardant");
  });
});