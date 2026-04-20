import { mount } from "@vue/test-utils";
import EventsList from "@/shared/organisms/EventsList.vue";

describe("EventsList", () => {
  const mockEvents = [
    { id: 1, nom: "Concert 1", data: "2026-06-01" },
    { id: 2, nom: "Concert 2", data: "2026-07-01" },
  ];

  it("renders events list", () => {
    const wrapper = mount(EventsList, {
      props: { events: mockEvents },
    });
    expect(wrapper.text()).toContain("Concert 1");
    expect(wrapper.text()).toContain("Concert 2");
  });

  it("shows header with title", () => {
    const wrapper = mount(EventsList, {
      props: { events: mockEvents },
    });
    expect(wrapper.text()).toContain("Gestió");
  });

  it("shows create new event button", () => {
    const wrapper = mount(EventsList, {
      props: { events: mockEvents },
    });
    expect(wrapper.text()).toContain("NOU EVENT");
  });

  it("shows loading state when loading prop is true", () => {
    const wrapper = mount(EventsList, {
      props: { events: [], loading: true },
    });
    expect(wrapper.text()).toContain("Carregant");
  });

  it("shows empty state when no events", () => {
    const wrapper = mount(EventsList, {
      props: { events: [] },
    });
    expect(wrapper.text()).toContain("Encara no hi ha");
  });

  it("shows error state when error prop is provided", () => {
    const wrapper = mount(EventsList, {
      props: { events: [], error: "Error de carrega" },
    });
    expect(wrapper.text()).toContain("Error");
  });

  it("emits create when new event button is clicked", async () => {
    const wrapper = mount(EventsList, {
      props: { events: mockEvents },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("create")).toBeTruthy();
  });

  it("emits preview when event preview button is clicked", async () => {
    const wrapper = mount(EventsList, {
      props: { events: mockEvents },
    });
    await wrapper.findAll("button").at(1)?.trigger("click");
    expect(wrapper.emitted("preview")).toBeTruthy();
  });

  it("emits edit when event edit button is clicked", async () => {
    const wrapper = mount(EventsList, {
      props: { events: mockEvents },
    });
    await wrapper.findAll("button").at(2)?.trigger("click");
    expect(wrapper.emitted("edit")).toBeTruthy();
  });

  it("emits delete when event delete button is clicked", async () => {
    const wrapper = mount(EventsList, {
      props: { events: mockEvents },
    });
    await wrapper.findAll("button").at(3)?.trigger("click");
    expect(wrapper.emitted("delete")).toBeTruthy();
  });
});