import { mount } from "@vue/test-utils";
import TicketList from "@/shared/organisms/TicketList.vue";
import { TicketMother } from "../mothers/TicketMother";

// Test bàsic de TicketList amb comentaris explicatius

describe("TicketList", () => {
  // Arrange: preparar una llista de tiquets
  it("mostra tots els tiquets rebuts per props", () => {
    const tickets = [TicketMother.basic(1), TicketMother.basic(2)];
    // Act: muntar el component amb la llista de tiquets
    const wrapper = mount(TicketList, {
      props: { tickets },
    });
    // Assert: comprovar que es mostren tots els codis de tiquet
    tickets.forEach((ticket) => {
      expect(wrapper.text()).toContain(ticket.code);
    });
  });

  // Els tests han d'estar documentats amb comentaris explicant el flux de negoci
});
