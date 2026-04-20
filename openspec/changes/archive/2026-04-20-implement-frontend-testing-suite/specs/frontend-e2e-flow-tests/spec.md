## ADDED Requirements

### Requirement: User flow E2E tests SHALL pass
Els tests E2E de flux d'usuari HAN DE validar el cami complet des de la home fins a la confirmacio de compra.

#### Scenario: User browses events
- **WHEN** l'usuari visita la pagina principal
- **THEN** veu la llista d'esdeveniments disponibles

#### Scenario: User selects event
- **WHEN** l'usuari fa click a un esdeveniment
- **THEN** navega a la pagina de detall de l'esdeveniment

#### Scenario: User selects seats
- **WHEN** l'usuari esta a la pagina de l'esdeveniment i selecciona seients
- **THEN** els seients seleccionats es mostren al resum

#### Scenario: User proceeds to checkout
- **WHEN** l'usuari te seients seleccionats i fa click a checkout
- **THEN** navega a la pagina de checkout

#### Scenario: User completes purchase
- **WHEN** l'usuari completa el formulari de checkout
- **THEN** mostra el modal d'exit i la comanda es crea

### Requirement: Admin flow E2E tests SHALL pass
Els tests E2E de flux d'admin HAN DE validar el cami complet des del login fins a la gestio d'esdeveniments.

#### Scenario: Admin logs in
- **WHEN** l'usuari administradr visita /admin i fa login
- **THEN** s'autentica correctament i navega al dashboard

#### Scenario: Admin views dashboard
- **WHEN** l'administrador esta loguejat
- **THEN** veu el dashboard amb les opcions de gestio

#### Scenario: Admin creates event
- **WITH** l'administrador loguejat
- **WHEN** crea un nou esdeveniment
- **THEN** l'esdeveniment apareix a la llista

#### Scenario: Admin edits event
- **WITH** l'administrador loguejat
- **WHEN** edita un esdeveniment existent
- **THEN** els canvis es guarden correctament

#### Scenario: Admin deletes event
- **WITH** l'administrador loguejat
- **WHEN** elimina un esdeveniment
- **THEN** l'esdeveniment desapareix de la llista