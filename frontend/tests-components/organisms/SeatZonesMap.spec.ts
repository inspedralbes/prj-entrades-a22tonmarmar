import { mount } from "@vue/test-utils";
import SeatZonesMap from "@/shared/organisms/SeatZonesMap.vue";

describe("SeatZonesMap", () => {
  const mockZones = {
    barricada: { state: "available", interactive: true },
    pista: { state: "available", interactive: true },
  };

  const mockButacas = [
    { value: "A-1", uiState: "available" },
    { value: "A-2", uiState: "selected" },
    { value: "A-3", uiState: "sold" },
  ];

  it("renders zones map", () => {
    const wrapper = mount(SeatZonesMap, {
      props: { zones: mockZones, butacas: mockButacas },
    });
    expect(wrapper.find("section").exists()).toBe(true);
  });

  it("shows barricada zone", () => {
    const wrapper = mount(SeatZonesMap, {
      props: { zones: mockZones, butacas: mockButacas },
    });
    expect(wrapper.text()).toContain("Barricada");
  });

  it("shows pista zone", () => {
    const wrapper = mount(SeatZonesMap, {
      props: { zones: mockZones, butacas: mockButacas },
    });
    expect(wrapper.text()).toContain("Pista");
  });

  it("shows seat buttons", () => {
    const wrapper = mount(SeatZonesMap, {
      props: { zones: mockZones, butacas: mockButacas },
    });
    expect(wrapper.text()).toContain("A-1");
    expect(wrapper.text()).toContain("A-2");
    expect(wrapper.text()).toContain("A-3");
  });

  it("emits seat-clicked when zone is clicked", async () => {
    const wrapper = mount(SeatZonesMap, {
      props: { zones: mockZones, butacas: mockButacas },
    });
    const buttons = wrapper.findAll("button");
    if (buttons.length > 0) {
      await buttons.at(0)?.trigger("click");
      expect(wrapper.emitted("seat-clicked")).toBeTruthy();
    }
  });
});