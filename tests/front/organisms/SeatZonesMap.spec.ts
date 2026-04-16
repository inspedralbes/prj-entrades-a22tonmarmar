import { mount } from "@vue/test-utils";
import SeatZonesMap from "@/shared/organisms/SeatZonesMap.vue";

describe("SeatZonesMap", () => {
  it("mostra el mapa de zones", () => {
    const wrapper = mount(SeatZonesMap, {
      props: { zones: [{ id: 1, name: "Zona A" }] },
    });
    expect(wrapper.text()).toContain("Zona A");
  });

  it("emeteix event quan es selecciona una zona", async () => {
    const wrapper = mount(SeatZonesMap, {
      props: { zones: [{ id: 1, name: "Zona A" }] },
    });
    await wrapper.find("button.zone").trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
  });
});
