## Context

El projecte te una estructura de testing basic a `tests/front/` que utilitza Jest. L'objectiu es migrar a Vitest pertenir una millor compatibilitat amb Vue 3 i @vue/test-utils.

### Estat Actual

- **Configuracio existent**: Jest a `tests/front/jest.config.js`
- **Test files**: 16 test files que utilitzen `@vue/test-utils`
- **Dependencies**: Jest, babel-jest, jest-environment-jsdom

### Restriccions

- Frontend: Nuxt 4 amb Vue 3
- Testing framework per components: @vue/test-utils (ja instal.lat)
- E2E framework: Playwright (no canvien)
- Mantenir mateixa funcionalitat als tests

## Goals / Non-Goals

**Goals:**

- Substituir Jest per Vitest
- Configurar vitest correctament per Vue 3
- Mantenir tots els tests existents funcionals

**Non-Goals:**

- Canviar funcionalitat dels tests
- Canviar E2E tests (Playwright)
- Canviar Pinia store tests

## Decisions

### D1: Vitest en lloc de Jest

**Alternativa considerada:** Mantenir Jest
**Racional:** Jest te problemes coneguts amb ESM modules a Vue 3. Vitest es mes modern i te suport natiu.

### D2: Configuracio a tests/front/

**Alternativa considerada:** Configuracio a level arrel
**Racional:** Mantenir estructura similar a l'actual per coherencia.

## Implementation

1. Canviar dependencies a tests/package.json
2. Crear vitest.config.ts
3. Actualitzar scripts a frontend/package.json
4. Verificar que tests funcionen