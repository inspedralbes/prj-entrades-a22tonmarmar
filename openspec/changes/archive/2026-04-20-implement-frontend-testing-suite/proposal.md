## Why

El projecte actualment disposa d'estructures basics de testing per a components Vue (organisms) utilitzant Jest, pero faltarien suites completes per validar el funcionament del frontend en tres areas claus: tests de components per als organisms existents, tests de flux E2E per a les navegacions tant d'usuari com d'admin, i tests especifics per a les stores de Pinia. Aquests tests son essencials per garantir la qualitat del codi i prevenir regressions en una aplicacio de compra d'entrades.

## What Changes

- **Component Tests per Organisms**: Ampliar els tests existents a `tests/front/organisms/` per cobrir tots els organisms creats (13 components actuals), implementant tests de renderitzacio, interaccio d'usuari i comportament.
- **E2E Flow Tests**: Crear una nova suite de tests de flux integrada a `tests/front/e2e/` utilitzant Playwright per simular el cami complet d'un usuari (seleccio d'esdeveniment, tria d'entrades, checkout) i el flux d'administrador (login, gestio d'esdeveniments).
- **Pinia Store Tests**: Crear tests especifics per a les stores a `tests/front/stores/` per validar el comportament de `useBookingStore` i `auth`, comprovant actions, getters i estat.
- **MotherObjects**: Implementar els models necessaris per als tests a `tests/shared/mothers/` i `tests/front/mothers/`.

## Capabilities

### New Capabilities

- `frontend-component-tests`: Suite completa de tests per tots els organisms del frontend (AdminLoginForm, CheckoutPanel, ConfirmDeleteModal, EventFormModal, EventPreviewModal, EventsList, EventsPreviewList, MobileSummaryDrawer, OrdersList, OrderSummaryPanel, SeatLegend, SeatSelectionPanel, SeatZonesMap, SuccessModal)
- `frontend-e2e-flow-tests`: Tests de flux end-to-end per a la ruta d'usuari (home -> event -> seats -> checkout -> confirmation) i ruta d'admin (/admin login -> dashboard -> gestio events)
- `frontend-pinia-store-tests`: Tests per a les stores de Pinia (useBookingStore, auth) validant estat, accions i getters

### Modified Capabilities

- `frontend-testing-structure`: Estructura de testing existent (buida)

## Impact

- **Directori nou**: `tests/front/e2e/`, `tests/front/stores/`, `tests/shared/mothers/`
- **Configuracio**: Nova configuracio de Playwright per E2E i extensio de Jest per stores
- **Dependencies**: Playwright (nou), potser @pinia/testing
- **Organismes afectats**: Tots els organisms a `frontend/app/shared/organisms/`