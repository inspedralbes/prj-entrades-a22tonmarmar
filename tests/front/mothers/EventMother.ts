// MotherObject per a Event per a tests de frontend
export class EventMother {
  static basic() {
    return {
      id: 1,
      name: "Concert de prova",
      date: "2026-06-01",
      availableTickets: 100,
      soldOut: false,
    };
  }

  static soldOut() {
    return {
      ...this.basic(),
      availableTickets: 0,
      soldOut: true,
    };
  }
}
