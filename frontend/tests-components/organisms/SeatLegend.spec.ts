import { mount } from "@vue/test-utils";
import SeatLegend from "@/shared/organisms/SeatLegend.vue";

describe("SeatLegend", () => {
  it("renders legend component", () => {
    const wrapper = mount(SeatLegend);
    expect(wrapper.text()).toContain("Leyenda");
  });

  it("shows available state label", () => {
    const wrapper = mount(SeatLegend);
    expect(wrapper.text()).toContain("disponible");
  });

  it("shows onHold state label", () => {
    const wrapper = mount(SeatLegend);
    expect(wrapper.text()).toContain("reservado");
  });

  it("shows selected state label", () => {
    const wrapper = mount(SeatLegend);
    expect(wrapper.text()).toContain("seleccionado");
  });

  it("shows sold state label", () => {
    const wrapper = mount(SeatLegend);
    expect(wrapper.text()).toContain("no disponible");
  });
});