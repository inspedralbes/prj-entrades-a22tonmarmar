import { mount } from "@vue/test-utils";
import EventsList from "@/shared/organisms/EventsList.vue";

// Test bàsic d'EventsList

describe("EventsList", () => {
  it("mostra una llista d'events", () => {
    const events = [
      { id: 1, name: "Concert 1" },
      { id: 2, name: "Concert 2" },
    ];
    const wrapper = mount(EventsList, {
      props: { events },
    });
    expect(wrapper.text()).toContain("Concert 1");
    expect(wrapper.text()).toContain("Concert 2");
  });

  it("emeteix event quan es selecciona un event", async () => {
    const events = [{ id: 1, name: "Concert 1" }];
    const wrapper = mount(EventsList, {
      props: { events },
    });
    await wrapper.find("li").trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
  });
});
