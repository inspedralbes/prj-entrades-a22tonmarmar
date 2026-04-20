## Context

El projecte te una estructura de testing basic a `tests/front/` que utilitza Jest per als organisms. L'objectiu es implementar una suite completa que cobreixi tres area fonamentals: testing de components (organisms), testing de flux (E2E), i testing de Pinia stores.

### Estat Actual

- **Configuracio existent**: Jest a `tests/front/jest.config.js` amb transformacio per Vue
- **Organisms existents**: 14 components a `frontend/app/shared/organisms/`
- **Stores existents**: 2 stores (useBookingStore, auth) a `frontend/app/stores/`
- **MotherObjects existents**: EventMother i TicketMother a `tests/front/mothers/`

### Restriccions

- Frontend: Nuxt 4 amb Vue 3
- Testing framework per components: Jest (no Vue Test Utils)
- E2E framework: Playwright
- Pinia: `@pinia/testing` per mock de stores

## Goals / Non-Goals

**Goals:**

- Implementar tests per a tots els 14 organisms existents
- Crear suite E2E completa per flux d'usuari i admin
- Implementar tests per a useBookingStore i auth store
- Crear MotherObjects necessaris per a cada tipus de test

**Non-Goals:**

- Testing de API (backend te els seus propis tests)
- Testing de rendiment o load testing
- Testing de integracio amb Socket.IO

## Decisions

### D1: Jest directe per components (no Vue Test Utils)

**Alternativa considerada:** Vue Test Utils
**Racional:** El projecte ja te una configuracio Jest existent. Introduir Vue Test Utils afegiria complexity innecessaria. Jest permet fer mount manual de components Vue.

### D2: Playwright per E2E

**Alternativa considerada:** Cypress
**Racional:** Playwright te millor suport per a aplicacions Vue/Nuxt i ofereix millor compatibilitat amb webcomponents. Tambe permet testing sense GUI.

### D3: @pinia/testing per a Pinia stores

**Alternativa considerada:** Mock manual de stores
**Racional:** @pinia/testing proporciona una API completa per a mockear stores de forma mes clean i soporta getters, actions i estat.

### D4: Estructura de directoris

**Estructura proposada:**

```
tests/
  front/
    organisms/       (existent - component tests)
    e2e/            (nou - flux tests)
    stores/         (nou - pinia tests)
    mothers/        (existent + ampliat)
  shared/
    mothers/        (nou - models compartits)
```

## Risks / Trade-offs

- **[Risc]** Nova dependencia de Playwright
  - **Mitigacio:** Mantenir Playwright com a dependencia de development nomes

- **[Risc]** Tests E2E son mes lenters que unit tests
  - **Mitigacio:** Separar les execucions: jest per a unit, playwright per a E2E

- **[Risc]** Canvi de configuracio Jest podria afectar tests existents
  - **Mitigacio:** Mantenir backwards compatibility i fer migracio gradual