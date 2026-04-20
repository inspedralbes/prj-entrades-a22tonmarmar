import { mount } from "@vue/test-utils";
import EventPreviewModal from "@/shared/organisms/EventPreviewModal.vue";

describe("EventPreviewModal", () => {
  const defaultEvent = {
    nom: "Concert Test",
    artista: "Artist Test",
    data: "2026-06-01",
    apertures_portes: "20:00",
    hora_inici: "21:00",
    descripcio: "Test description",
    imatge: "",
    tiquet: {
      preu_base: 25,
      preu_barricada: 50,
      preu_butaca: 35,
    },
  };

  it("renders modal when visible is true", () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.find("modal").exists()).toBe(true);
  });

  it("shows event name", () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.text()).toContain("Concert Test");
  });

  it("shows event artist", () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.text()).toContain("Artist Test");
  });

  it("shows event date", () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.text()).toContain("2026-06-01");
  });

  it("shows ticket prices", () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.text()).toContain("Preu general");
    expect(wrapper.text()).toContain("Preu barricada");
    expect(wrapper.text()).toContain("Preu butaca");
  });

  it("shows close button", () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: defaultEvent },
    });
    expect(wrapper.text()).toContain("Tancar");
  });

  it("emits close when close button is clicked", async () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: defaultEvent },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("shows sold out badge when event is sold out", () => {
    const wrapper = mount(EventPreviewModal, {
      props: { visible: true, event: { ...defaultEvent, sold_out: true } },
    });
    expect(wrapper.text()).toContain("SOLD OUT");
  });
});