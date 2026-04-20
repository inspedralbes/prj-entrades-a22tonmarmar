## Why

La suite de testing actual utilitza Jest directament amb configuracio manual que esta resultant dificil de fer funcionar correctament (problemes amb ESM, transformacio, i resolucio de moduls). Canviar a Vitest amb @vue/test-utils proporcionara una experiencia mes estable i integrada amb Vue 3, aparte de ser la forma recomanada per Testing de components.

## What Changes

- **Canviar de Jest a Vitest**: Vitest te millor suport natiu per a ESM i mes facil integracio amb Vue
- **Mantenir @vue/test-utils**: Els tests ja utilitzen aquesta llibreria, nomes cal canviar el test runner
- **Simplificar configuracio**: Vitest comparteix molts parametres compatible amb Jest, facilitant la transicio
- **Mantenir funcionalitat**: Els mateixos test files, nomes canviar l'execucio

## Capabilities

### Modified Capabilities

- `frontend-component-tests`: Canviar de Jest a Vitest per millor compatibilitat

## Impact

- **Configuracio**: Canviar jest.config.js a vitest.config.ts
- **Scripts**: Actualitzar npm scripts a frontend/package.json
- **Dependencies**: Canviar jest per vitest a tests/package.json
- **Test files**: Cap canvi (compatible amb ambdos runners)