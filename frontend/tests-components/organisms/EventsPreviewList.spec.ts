import { mount } from "@vue/test-utils";
import EventsPreviewList from "@/shared/organisms/EventsPreviewList.vue";

describe("EventsPreviewList", () => {
  const mockEvents = [
    { id: 1, nom: "Concert 1", data: "2026-06-01", artista: "Artist 1" },
    { id: 2, nom: "Concert 2", data: "2026-07-01", artista: "Artist 2" },
  ];

  it("renders events preview list", () => {
    const wrapper = mount(EventsPreviewList, {
      props: { events: mockEvents },
    });
    expect(wrapper.text()).toContain("Concert 1");
    expect(wrapper.text()).toContain("Concert 2");
  });

  it("shows empty state when no events", () => {
    const wrapper = mount(EventsPreviewList, {
      props: { events: [] },
    });
    expect(wrapper.text()).toContain("No hi ha");
  });

  it("shows loading state when loading prop is true", () => {
    const wrapper = mount(EventsPreviewList, {
      props: { events: [], loading: true },
    });
    expect(wrapper.text()).toContain("Carregant");
  });

  it("shows event artists", () => {
    const wrapper = mount(EventsPreviewList, {
      props: { events: mockEvents },
    });
    expect(wrapper.text()).toContain("Artist 1");
    expect(wrapper.text()).toContain("Artist 2");
  });
});