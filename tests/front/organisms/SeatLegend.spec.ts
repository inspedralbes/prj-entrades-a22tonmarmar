import { mount } from "@vue/test-utils";
import SeatLegend from "@/shared/organisms/SeatLegend.vue";

describe("SeatLegend", () => {
  it("mostra la llegenda de seients", () => {
    const wrapper = mount(SeatLegend);
    expect(wrapper.text().toLowerCase()).toContain("llegenda");
  });
});
