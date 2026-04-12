import { mount } from "@vue/test-utils";
import SeatSelectionPanel from "@/shared/organisms/SeatSelectionPanel.vue";

describe("SeatSelectionPanel", () => {
  it("mostra el panell de selecció de seients", () => {
    const wrapper = mount(SeatSelectionPanel, {
      props: { seats: [{ id: 1, available: true }] },
    });
    expect(wrapper.text().toLowerCase()).toContain("seient");
  });

  it("emeteix event quan es selecciona un seient", async () => {
    const wrapper = mount(SeatSelectionPanel, {
      props: { seats: [{ id: 1, available: true }] },
    });
    await wrapper.find("button.seat").trigger("click");
    expect(wrapper.emitted("select")).toBeTruthy();
  });
});
