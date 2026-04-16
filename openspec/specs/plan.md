# Plan: Implementació de la Suite de Testing

## 1. Objectiu del pla

Implementar les suites de testing definides a foundations.md i a specs/spec.md, organitzant-les sota la carpeta arrel `/tests`, diferenciades entre **front** i **e2e**, i garantint que es puguin executar tant en local com en CI/CD, amb neteja completa de la infraestructura de tests.

Estructura objectiu:

- `/tests/front` – tests de frontend centrats en components **organism**.
- `/tests/front/mothers` – MotherObjects específics de frontend.
- `/tests/e2e` – tests E2E amb Cypress del flux de compra.
- `/tests/e2e/mothers` – MotherObjects específics d’escenaris E2E.
- `/tests/shared/mothers` – carpeta compartida de MotherObjects quan es reutilitzen entre front i e2e.

---

## 2. Organització de carpetes i fitxers

### 2.1. Carpeta `/tests/front`

Objectiu: agrupar tots els tests unitàries/integradors dels components de frontend (sobretot organisms) en un espai clar i coherent.

Passos:

1. Crear l’estructura base:
   - `/tests/front/organisms/`
   - `/tests/front/mothers/` per a MotherObjects de domini al frontend.
2. Per **cada component organism** existent a `frontend/app/shared/organisms/`:
   - Crear un fitxer de test corresponent a `/tests/front/organisms/<NomOrganism>.spec.ts`.
   - A l’interior, afegir comentaris que expliquin clarament:
     - El cas d’ús que es prova.
     - Les fases _Arrange / Act / Assert_.
3. Definir (o adaptar) l’aliàs de mòduls perquè els tests de `/tests/front` puguin importar components i serveis del frontend (Nuxt/Vite config, `tsconfig.json`, etc.).

### 2.2. Carpeta `/tests/e2e`

Objectiu: contenir tots els tests Cypress del flux de compra i, a futur, d’altres fluxos E2E.

Passos:

1. Crear l’estructura base:
   - `/tests/e2e/cypress.config.(js|ts)` – configuració principal de Cypress.
   - `/tests/e2e/tests/` – fitxers de test E2E.
   - `/tests/e2e/mothers/` – MotherObjects específics per preparar dades d’escenaris E2E (per exemple, payloads, respostes mockades, etc.).
   - (Opcional) `/tests/e2e/fixtures/` – dades d’entrada mock.
   - (Opcional) `/tests/e2e/support/` – comandes personalitzades.
2. Crear un fitxer de test principal per al flux de compra:
   - `/tests/e2e/tests/purchase-ticket.spec.ts`.
   - Documentar amb comentaris:
     - Cada `describe` com a cas d’ús (compra autenticada, compra com a nou usuari, errors bàsics).
     - Cada `it` com a escenari concret, descrivint el flux pas a pas.

---

## 3. Tooling de frontend (tests de components)

### 3.1. Configuració de Jest / runner de tests

Passos:

1. Afegir Jest (si no hi és) al `frontend/package.json` juntament amb les dependències necessàries per a Vue 3 / Nuxt 4 (per exemple, `@vue/test-utils`, `vue-jest` o equivalents recomanats per a Nuxt 4).
2. Crear un fitxer de configuració de Jest (p. ex. `jest.config.ts` o `jest.config.cjs`) que:
   - Inclogui `/tests/front` com a arrel de tests o com a pattern principal de cerca.
   - Defineixi alias per resoldre imports des de `app/` (en coherència amb `tsconfig.json` i `nuxt.config.ts`).
   - Configuri el transform adequat per a fitxers `.vue` i `.ts`.
3. Configurar Vue Test Utils o Testing Library per Vue com a llibreria principal de renderitzat de components dins de Jest.

### 3.2. Scripts d’execució

Al `frontend/package.json`:

- Afegir un script per executar tots els tests de frontend:
  - Exemple: `"test:front": "jest"` (o `"jest --config jest.config.ts"` si cal indicar el fitxer explícitament).
- Afegir un script per execució en mode watch per als desenvolupadors:
  - Exemple: `"test:front:watch": "jest --watch"`.

En CI/CD, es farà servir principalment `npm run test:front`.

---

## 4. Tooling E2E amb Cypress

### 4.1. Configuració bàsica de Cypress

Passos:

1. Afegir Cypress com a dependència de desenvolupament (idealment al `frontend/package.json`, o bé a nivell arrel si es prefereix):
   - Exemple: `"test:e2e": "cypress run --config-file ./tests/e2e/cypress.config.ts"`.
2. Configurar `cypress.config.(js|ts)` dins `/tests/e2e` per:
   - Apuntar a la URL del frontend en mode test/e2e.
   - Configurar rutes de tests, fixtures i support.

### 4.2. Scripts d’execució

Afegir scripts al `package.json` (frontend o arrel, segons decisió):

- Per executar Cypress en local (interactiu):
  - `"test:e2e:open": "cypress open --config-file ./tests/e2e/cypress.config.ts"`.
- Per executar Cypress en mode headless (local o CI):
  - `"test:e2e": "cypress run --config-file ./tests/e2e/cypress.config.ts"`.

---

## 5. Infraestructura de tests i integració amb CI/CD

### 5.1. Scripts per aixecar/aturar l’entorn de tests

Objectiu: permetre que les suites (sobretot E2E) s’executin tant en local com en CI sense dependències manuals.

Passos:

1. Revisar o afegir objectius al `Makefile` i/o scripts npm a arrel per:
   - `tests:up`: aixecar serveis de tests (via `docker-compose` o scripts existents):
     - DB de tests (PostgreSQL).
     - Backend Laravel en mode testing (`.env.testing`).
     - Servidor de sockets en mode tests.
     - Frontend Nuxt apuntant a aquests serveis.
   - `tests:seed`: aplicar migracions i seeders basats en MotherObjects per preparar dades de proves.
   - `tests:down`: aturar i netejar tots els serveis de tests.
2. Integrar aquests objectius amb els scripts de test:
   - En local, documentar l’ús seqüencial (p. ex. `make tests:up`, `npm run test:e2e`, `make tests:down`).
   - En CI, configurar el pipeline perquè executi:
     - Setup de l’entorn de tests.
     - `npm run test:front` i `npm run test:e2e`.
     - Neteja final (`tests:down`).

### 5.2. Integració amb el pipeline de CI/CD

Passos:

1. Actualitzar la configuració de CI/CD (GitHub Actions, GitLab CI, etc.) per incloure passos:
   - Instal·lació de dependències.
   - Execució de tests de frontend: `npm run test:front`.
   - Execució de tests E2E: `npm run test:e2e` amb l’entorn de tests actiu.
2. Assegurar que qualsevol fallada en aquestes fases:
   - Atura el pipeline.
   - Marca la build com a fallida.

---

## 6. Dades de proves i MotherObjects

### 6.1. Backend Laravel

Passos:

1. Crear MotherObjects en PHP per als principals models de domini (Event, EventRoom, Order, Ticket, User, etc.).
2. Integrar aquests MotherObjects en seeders i/o helpers de tests per preparar escenaris:
   - Usuari de proves per a compres autenticades.
   - Events amb diferents estats (disponible, exhaurit, etc.).
3. Documentar com es reinicia l’estat (drop + migrate + seed) abans de llançar tests E2E.

### 6.2. Frontend i E2E

Passos:

1. Crear MotherObjects JavaScript/TypeScript (si cal) per a dades de domini utilitzades en tests d’organisms (ex: EventMother, EventRoomMother) i per a escenaris E2E.
2. Ubicar-los inicialment a `/tests/front/mothers/` (tests de components) i `/tests/e2e/mothers/` (tests E2E).
3. Quan en una de les carpetes de tests (front o e2e) hi hagi més de dos MotherObjects que siguin compartibles entre ambdós contextos, moure’ls (o crear-ne versions compartides) a `/tests/shared/mothers/` i referenciar-los des d’allà tant en els tests de front com en els d’E2E.

---

## 7. Roadmap d’implementació (ordre recomanat)

1. Definir i crear l’estructura `/tests/front` i `/tests/e2e`.
2. Configurar Jest com a runner per a `/tests/front` i verificar que pot executar un test senzill.
3. Configurar Cypress a `/tests/e2e` i crear un primer test mínim del flux de compra (happy path).
4. Crear els primers MotherObjects al backend Laravel i integrar-los amb seeders per l’escenari de compra.
5. Implementar scripts de Makefile / npm per aixecar i tombar l’entorn de tests.
6. Afegir scripts `test:front`, `test:front:watch`, `test:e2e`, `test:e2e:open`.
7. Integrar les noves comandes al pipeline de CI/CD.
8. Iterar afegint tests per a cada organism i afegint escenaris E2E addicionals segons necessitats de producte.

Aquest pla servirà com a guia per implementar pas a pas l’estratègia de testing definida a foundations.md i a specs/spec.md, assegurant una estructura clara a `/tests` i una experiència coherent tant en local com en CI/CD.
