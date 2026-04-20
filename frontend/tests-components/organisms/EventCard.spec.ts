import { mount } from "@vue/test-utils";
import EventCard from "@/shared/organisms/EventCard.vue";
import { EventMother } from "../mothers/EventMother";

// Test bàsic d'EventCard amb comentaris explicatius

describe("EventCard", () => {
  // Arrange: preparar un event bàsic
  it("mostra el nom i la data de l'event", () => {
    const event = EventMother.basic();
    // Act: muntar el component amb l'event
    const wrapper = mount(EventCard, {
      props: { event },
    });
    // Assert: comprovar que es mostra el nom i la data
    expect(wrapper.text()).toContain(event.name);
    expect(wrapper.text()).toContain(event.date);
  });

  // Arrange: preparar un event esgotat
  it("mostra missatge d'esgotat si no hi ha entrades", () => {
    const event = EventMother.soldOut();
    const wrapper = mount(EventCard, {
      props: { event },
    });
    // Assert: comprovar que es mostra el missatge d'esgotat
    expect(wrapper.text().toLowerCase()).toContain("esgotat");
  });

  // Els tests han d'estar documentats amb comentaris explicant el flux de negoci
});
