# Spec: Suites de Testing (Frontend Organisms + E2E Compra d’Entrades)

## 1. Objectiu general

Definir el comportament esperat de les suites de testing del projecte d’entrades, dividides en:

1. Suite de tests de frontend centrada en components tipus **organism**.
2. Suite de tests E2E amb Cypress que valida el flux complet de compra d’una entrada.

Aquestes suites han de poder executar-se:

- En **local**, per donar suport al desenvolupament de noves funcionalitats.
- En **CI/CD**, com a part del pipeline d’integració i desplegament continu.

## 2. Comportament esperat: tests de frontend (organisms)

### 2.1. Abast i criteris

Per **cada component organism**:

- Ha d’existir un **arxiu de test específic** que el provi unitàriament.
  - Exemple de patrons (a concretar a l’implementació):
    - app/shared/organisms/OrganismName/OrganismName.spec.ts
    - o bé app/shared/organisms/**tests**/OrganismName.spec.ts
- Els tests han de cobrir, com a mínim:
  - Renderitzat bàsic amb les props mínimes requerides.
  - Renderitzat amb variacions rellevants de props (p. ex. event exhaurit vs. disponible).
  - Interaccions d’usuari (clicks, canvis de formulari, selecció d’entrades, etc.).
  - Maneig d’estats de càrrega i error (loading, error del backend, desconnexió de sockets, etc.).
  - Comunicació amb l’exterior:
    - Emissió d’events (emits) esperats cap a la view/page.
    - Crides a serveis i stores amb els paràmetres correctes (mitjançant mocks/spies).

### 2.2. Comentaris i llegibilitat

- Els arxius de test dels organisms han d’incloure **comentaris clars** que expliquin el procés de cada cas de prova, separant mentalment les fases:
  - "Arrange": preparació de dades (incloent ús de MotherObjects de frontend quan calgui) i configuració del component.
  - "Act": acció de l’usuari o esdeveniment que es vol provar.
  - "Assert": verificacions sobre el DOM, els events emesos i les crides als serveis.
- Els comentaris han de descriure **el perquè** del test (comportament de negoci) i no només el què fa el codi de test.

### 2.3. Execució en local i en CI

- S’ha de definir una comanda de test de components reutilitzable:
  - Local: execució en mode watch per facilitar TDD o desenvolupament iteratiu.
  - CI: execució en mode no interactiu, amb sortida adequada per a fallades.
- Comportament esperat:
  - En local, el desenvolupador pot executar només els tests relacionats amb un organism concret (p. ex. filtrant per nom de fitxer o per nom de suite).
  - En CI, s’executa la suite completa de tests de components, i qualsevol fallada impedeix avançar el pipeline.

## 3. Comportament esperat: tests E2E amb Cypress (flux de compra)

### 3.1. Escenaris de negoci

La suite E2E ha de validar, com a mínim, els següents comportaments:

1. **Compra exitosa per a usuari autenticat**
   - Donat que existeix un usuari de proves i un event amb entrades disponibles.
   - Quan l’usuari inicia sessió, selecciona un event, escull el nombre d’entrades i confirma la compra.
   - Aleshores el sistema ha de:
     - Mostrar un resum de la comanda.
     - Mostrar els tiquets generats.
     - Reflectir la nova disponibilitat d’entrades (si aplica) de manera coherent al front.

2. **Compra com a nou usuari (si el domini ho permet)**
   - Donat que no existeix l’usuari a la base de dades de proves.
   - Quan l’usuari es registra durant el procés de compra i continua el flux.
   - Aleshores s’espera el mateix resultat que en la compra exitosa (resum i tiquets), amb l’usuari nou creat.

3. **Gestió d’errors bàsics**
   - Intentar comprar sense haver seleccionat entrades:
     - S’han de mostrar missatges de validació i no s’ha d’enviar la petició de compra al backend.
   - Errors provinents del backend (p. ex. esgotament d’entrades durant el procés):
     - Quan el backend rebutja la petició, el front ha de mostrar un missatge d’error clar i no ha de mostrar el resum de comanda.
   - Desconnexió o problemes amb sockets (si afecten al flux):
     - El comportament ha de ser controlat (p. ex. reintents, missatge d’avís, etc.), segons es defineixi a nivell de producte.

### 3.2. Comentaris i estructura dels tests E2E

- Els fitxers de Cypress han d’estar fortament documentats amb **comentaris per blocs**:
  - Explicant l’objectiu de cada `describe` (cas d’ús de negoci) i de cada `it` (escenari concret).
  - Explicant, dins de cada test, les fases principals (navegació, selecció d’event, login/registre, confirmació, verificacions).
- Els comentaris han d’ajudar a entendre el flux de negoci de compra d’entrades sense haver de conèixer a fons el codi del frontend o del backend.

### 3.3. Execució en local i en CI/CD

- **Local**:
  - Possibilitat d’executar Cypress en mode interactiu (GUI) per facilitar el debugging dels fluxos.
  - Possibilitat d’executar Cypress en mode headless contra l’entorn de tests local.
- **CI/CD**:
  - Cypress s’ha d’executar en mode headless com a part del pipeline.
  - La suite ha de:
    - Arrencar (o assumir arrencats) el frontend, el backend Laravel i el servidor de sockets apuntant a una base de dades de tests.
    - Un cop acabats els tests, l’entorn s’ha d’aturar i/o netejar, assegurant que no queden recursos oberts.
- Comportament esperat del pipeline:
  - Si qualsevol test E2E falla, el pas de pipeline corresponent ha de fallar i bloquejar el desplegament.

## 4. Gestió d’infraestructura i neteja

### 4.1. Creació i destrucció controlada

- Les suites de testing **no** han de dependre d’infraestructura manualment arrencada.
- S’espera l’existència de scripts automatitzats (Makefile, scripts npm o docker-compose específics) que:
  - Engeguin l’entorn de tests (DB de tests, Laravel en mode testing, servidor de sockets, frontend apuntant a aquests serveis).
  - Apliquin migracions i seeders basats en MotherObjects per preparar l’estat inicial.
  - Aturin i destrueixin l’entorn en finalitzar la suite (especialment en CI/CD).

### 4.2. Consistència de dades amb MotherObjects

- Tant per a tests de components com per a E2E, quan calguin dades de domini complexes (events, sales, comandes, tiquets, usuaris):
  - S’han d’utilitzar MotherObjects (tant al backend Laravel com, si cal, al frontend) per garantir:
    - Dades repetibles entre execucions.
    - Noms i estructures coherents entre diferents tests.
- En E2E, l’estat inicial de la base de dades de tests ha de provenir d’aquests MotherObjects (via seeders o helpers d’inicialització).

## 5. Criteris d’acceptació de la funcionalitat de testing

Es considera que la funcionalitat de testing està complerta quan:

1. **Per als organisms de frontend**:
   - Cada component organism del projecte té un arxiu de test associat.
   - Els tests passen en local i en CI amb una única comanda de test de components.
   - Els arxius de test tenen comentaris suficients per entendre el flux de cada cas de prova.

2. **Per als tests E2E de compra**:
   - Existeix una suite Cypress que cobreix com a mínim els escenaris descrits a l’apartat 3.1.
   - Es pot executar la suite E2E en local (interactiu i headless) amb una comanda documentada.
   - El pipeline de CI/CD inclou un pas que executa aquesta suite E2E i falla si algun test falla.

3. **Per a la infraestructura de testing**:
   - Hi ha scripts (o targets de Makefile) documentats que creen i destrueixen tota la infraestructura de tests.
   - Després d’una execució completa en CI, no queden contenidors, processos ni dades persistents no desitjades associades a l’entorn de tests.

Aquesta especificació descriu el comportament esperat; els detalls concrets d’implementació (noms de scripts, ubicació exacta de fitxers, etc.) s’han d’alinear amb les convencions definides a foundations.md i al codi existent del projecte.
