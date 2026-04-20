## 1. Setup i Configuracio

- [x] 1.1 Instal.lar Playwright com a dependencia de development
- [x] 1.2 Instal.lar @pinia/testing per a tests de stores
- [x] 1.3 Crear configuracio de Playwright a playwright.config.ts
- [x] 1.4 Actualitzar jest.config.js per inclure tests de stores

## 2. MotherObjects

- [x] 2.1 Crear EventMother complet a tests/shared/mothers/EventMother.ts
- [x] 2.2 Crear TicketMother a tests/shared/mothers/TicketMother.ts
- [x] 2.3 Crear UserMother a tests/shared/mothers/UserMother.ts
- [x] 2.4 Crear OrderMother a tests/shared/mothers/OrderMother.ts

## 3. Component Tests (Organisms)

- [x] 3.1 Actualitzar AdminLoginForm.spec.ts
- [x] 3.2 Actualitzar CheckoutPanel.spec.ts
- [x] 3.3 Actualitzar ConfirmDeleteModal.spec.ts
- [x] 3.4 Actualitzar EventFormModal.spec.ts
- [x] 3.5 Actualitzar EventPreviewModal.spec.ts
- [x] 3.6 Actualitzar EventsList.spec.ts
- [x] 3.7 Actualitzar EventsPreviewList.spec.ts
- [x] 3.8 Actualitzar MobileSummaryDrawer.spec.ts
- [x] 3.9 Actualitzar OrdersList.spec.ts
- [x] 3.10 Actualitzar OrderSummaryPanel.spec.ts
- [x] 3.11 Actualitzar SeatLegend.spec.ts
- [x] 3.12 Actualitzar SeatSelectionPanel.spec.ts
- [x] 3.13 Actualitzar SeatZonesMap.spec.ts
- [x] 3.14 Actualitzar SuccessModal.spec.ts

## 4. E2E Flow Tests

- [x] 4.1 Crear test e2e/user-flow.spec.ts per al flux d'usuari
- [x] 4.2 Crear test e2e/admin-flow.spec.ts per al flux d'admin
- [x] 4.3 Configurar baseURL i autenticacio per als tests E2E

## 5. Pinia Store Tests

- [x] 5.1 Crear useBookingStore.spec.ts a tests/front/stores/
- [x] 5.2 Crear auth.spec.ts a tests/front/stores/
- [x] 5.3 Implementar tests per a totes les accions i getters

## 6. Scripts i Documentacio

- [x] 6.1 Afegir scripts a package.json per executar els diferents tests
- [x] 6.2 Crear README.md a tests/ amb instruccions d'execucio
- [x] 6.3 Verificar que tots els tests passin