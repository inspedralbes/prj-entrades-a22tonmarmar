# Foundations de Testing del Projecte d’Entrades

## Context del projecte

- Frontend: Nuxt 4, arquitectura atòmica (atoms, molecules, organisms, views/pages).
- Backend principal: Laravel + PostgreSQL per a tota la lògica de domini i persistència.
- Backend temps real: Node.js + socket.io per sincronitzar estat (per exemple, disponibilitat d’entrades) entre clients i Laravel.

L’objectiu d’aquesta fondation és definir una estratègia de testing dividida en dues grans parts:

1. Testing de frontend centrat en els organisms.
2. Testing E2E amb Cypress simulant la compra completa d’una entrada.

En tots els casos, qualsevol infraestructura utilitzada durant els tests s’ha de poder crear i destruir de forma controlada, deixant l’entorn net. Quan calguin dades de domini complexes, s’utilitzaran MotherObjects.

---

## 1. Testing de frontend (organisms)

### Objectiu

Assegurar que els organisms (components de nivell alt que combinen atoms i molecules) funcionen de forma correcta, estable i aïllada, de manera que les views/pages que els utilitzen siguin el més primes possibles i tinguin menys necessitat de tests específics.

### Stack de testing proposat

- Runner: Vitest (integrat amb l’ecosistema Vite/Nuxt 4).
- Render de components: Vue Test Utils o Testing Library per Vue (segons preferència del projecte, prioritzant un estil més “user-centric”).
- Ús de mocks i spies per a:
  - Serveis d’API (p. ex. app/services/\*.js).
  - Stores de Pinia (p. ex. app/stores/\*.js).
  - SocketService per evitar dependències reals de socket.io en els tests de unitat.

### Abast dels tests d’organisms

Per cada organism clau (especialment els implicats en el flux de compra), els tests han de cobrir:

- Renderitzat bàsic:
  - Que el component es renderitza sense errors amb les props mínimes requerides.
  - Que mostra la informació d’entrada, esdeveniment, disponibilitat, etc.
- Interaccions d’usuari:
  - Clicks en botons d’afegir/eliminar entrades.
  - Canvis en selectors (data, sessió, zona, nombre d’entrades, etc.).
  - Validació de formularis (p. ex. dades d’usuari, login, confirmació de compra).
- Contracte amb el domini (MotherObjects quan calgui):
  - Quan un organism necessiti instàncies d’event, eventRoom, order o tiquet amb estructura complexa, es crearan MotherObjects JavaScript (p. ex. EventMother, EventRoomMother, OrderMother, TicketMother) per construir objectes de prova consistents.
- Comunicació amb serveis:
  - Comprovació que es fan crides als serveis d’API correctes amb els paràmetres esperats (mock d’API client o de services específics).
  - Comprovació que els organismes emeten events cap a les views o actualitzen el store com s’espera.

### Organització dels fitxers de tests

- Un directori de tests de components, per exemple:
  - app/shared/organisms/**tests**/<NomOrganism>.spec.ts
  - O bé un patró similar integrat amb la convenció de Nuxt 4.
- Directori específic per a MotherObjects de frontend, p. ex.:
  - app/services/mappers/**tests**/mothers/
  - o bé app/tests/mothers/frontend/ segons l’estructura que es decideixi.

Els tests de components no han d’aixecar cap infraestructura externa (ni base de dades, ni HTTP real, ni sockets reals). Tot s’ha de simular o mockejar.

---

## 2. Testing E2E amb Cypress (compra d’una entrada)

### Objectiu

Simular el procés real de compra d’una entrada per a un concert, cobrint tot el flux des del punt de vista de l’usuari final:

1. Navegar per la pàgina d’inici.
2. Seleccionar un event.
3. Seleccionar sessió/sala/entrades.
4. Autenticar-se (o registrar-se) si cal.
5. Confirmar la compra.
6. Verificar que la comanda i els tiquets s’han creat correctament (des del front i, opcionalment, comprovant rastres al backend exposats via API).

### Stack i integració

- Eina: Cypress (última versió estable compatible amb el projecte).
- Mode: tests E2E (no només component testing de Cypress).
- Execució:
  - Cypress ha d’aixecar-se contra un entorn específic de tests (veure secció d’infraestructura).
  - Es recomana tenir un script a package.json del frontend per llançar Cypress de forma controlada.

### Escenaris mínims E2E

Es defineixen, com a mínim, els següents escenaris:

1. Flux de compra exitós (usuari autenticat):
   - L’usuari inicia sessió.
   - Selecciona un event disponible.
   - Tria nombre d’entrades/ubicació.
   - Confirma la compra.
   - El sistema mostra un resum de comanda i els tiquets associats.

2. Flux de compra com a nou usuari (si el domini ho contempla):
   - L’usuari es registra durant el procés de compra.
   - Completa el flux igual que l’escenari anterior.

3. Validació d’errors bàsics:
   - Intentar comprar sense seleccionar entrades.
   - Gestionar errors que vinguin del backend (p. ex. esgotament d’entrades durant el procés, conflictes de disponibilitat rebuts via socket).

### Ús de MotherObjects en E2E

Per preparar dades de prova coherents des del backend:

- Al backend Laravel:
  - Es definiran MotherObjects en PHP (p. ex. EventMother, EventRoomMother, OrderMother, TicketMother, UserMother) que encapsulin la creació de models i les relacions necessàries per als escenaris E2E.
  - Aquests MotherObjects es poden utilitzar en seeders o com a helpers de tests per garantir dades consistents.
- Per al backend de sockets:
  - Qualsevol estat necessari (per exemple, sales inicials, configuració de canals) s’ha de poder inicialitzar de forma determinista quan s’inicia el servidor de tests.

Els tests de Cypress assumiran que l’entorn de tests ja té les dades mínimes carregades (via seeders/MotherObjects) o bé utilitzaran una API interna dedicada a preparar escenaris (només disponible en entorn de tests).

---

## 3. Infraestructura de testing i neteja

### Entorns i configuració

Per garantir que els tests no embruten l’entorn de desenvolupament ni producció, s’estableixen les següents normes:

- Entorn específic de tests per a Laravel:
  - Fitxer .env.testing (o equivalent) amb una base de dades PostgreSQL de tests separada.
  - Comandes per a migrar i fer seed abans dels tests (p. ex. `php artisan migrate --env=testing` i seeders específics que utilitzen MotherObjects).
- Entorn específic per al servidor de sockets:
  - Configuració de port i connexió a Laravel adequada per a l’entorn de tests.
  - Possibilitat de reiniciar el servidor entre suites de Cypress si cal.
- Entorn de frontend:
  - Nuxt arrencat en mode test/e2e (p. ex. `npm run dev:e2e` o `npm run build && npm run start:e2e`) apuntant als backends de tests.

Es recomana encapsular tot això en scripts o en un fitxer docker-compose específic per a testing, de manera que aixecar i parar l’entorn sigui trivial.

### Cicle de vida dels tests i neteja

Requisit fonamental: en acabar els tests, tota la infraestructura i l’estat han de quedar nets i gestionables.

- Per als tests de frontend (Vitest):
  - No s’aixeca cap servei extern: només es fan servir mocks.
  - No hi ha efectes persistents fora del procés de testing.

- Per als tests E2E (Cypress):
  - Abans d’executar la suite:
    - Aixecar serveis necessaris (Laravel, DB de tests, servidor de sockets, frontend).
    - Executar migracions i seeders.
  - Després d’acabar la suite:
    - Aturar tots els serveis (containers/demons) relacionats amb l’entorn de tests.
    - Netejar la base de dades de tests:
      - Idealment, es fa `drop` de l’esquema o de la base de dades sencera i es recrea en la propera execució.
      - Alternativament, es poden utilitzar transaccions o truncates sistemàtics.

La responsabilitat de crear i destruir aquesta infraestructura s’ha de centralitzar en scripts repetibles (per exemple, objectius del Makefile o scripts de npm/yarn/pnpm) per evitar inconsistències.

---

## 4. Principis generals

- Cap test ha de dependre de l’estat manual d’un entorn extern: tot s’ha de poder posar en marxa automatitzadament.
- Les dades de domini complexes sempre s’han de construir via MotherObjects (tant en PHP/Laravel com en JS/TS al frontend) per facilitar manteniment i consistència.
- Els tests de components d’UI (organisms) han de ser ràpids, aïllats i deterministes.
- Els tests E2E han de cobrir pocs fluxos però crítics (happy path principal i alguns errors importants), prioritzant la robustesa per sobre de la quantitat.

Aquesta fondation serveix com a base; qualsevol decisió concreta d’implementació (llibreries exactes, noms de scripts, estructura de carpetes de tests) s’haurà d’alinear amb el codi existent i documentar-se a mesura que s’implementi la suite de testing.
