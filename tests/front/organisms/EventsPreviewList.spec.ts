import { mount } from "@vue/test-utils";
import EventsPreviewList from "@/shared/organisms/EventsPreviewList.vue";

describe("EventsPreviewList", () => {
  it("mostra previews d'events", () => {
    const events = [{ id: 1, name: "Concert Preview" }];
    const wrapper = mount(EventsPreviewList, {
      props: { events },
    });
    expect(wrapper.text()).toContain("Concert Preview");
  });
});
