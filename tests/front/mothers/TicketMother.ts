// MotherObject per a Ticket per a tests de frontend
export class TicketMother {
  static basic(id = 1) {
    return {
      id,
      code: `TICKET-${id}`,
      eventName: "Concert de prova",
      seat: `Fila 1, Seient ${id}`,
    };
  }
}
