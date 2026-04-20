## ADDED Requirements

### Requirement: Organisms component tests SHALL pass
Tots els organisms del frontend HAN DE disposar de tests que validin la seva renderitzacio, interaccio d'usuari i comportament.

#### Scenario: AdminLoginForm renders correctly
- **WHEN** el component AdminLoginForm es renderitzat
- **THEN** mostra un formulari amb camps email i password i boto de submit

#### Scenario: AdminLoginForm emits login event
- **WHEN** l'usuari omple email i password correctament i fa submit
- **THEN** s'emet l'event 'login' amb les dades del formulari

#### Scenario: CheckoutPanel displays items
- **WHEN** el component CheckoutPanel rep una llista d'entrades
- **THEN** mostra cada entrada amb nom, preu i quantitat

#### Scenario: CheckoutPanel calculates total
- **WHEN** el component CheckoutPanel te entrades afegides
- **THEN** calcula i mostra el total correctament

#### Scenario: ConfirmDeleteModal shows confirmation
- **WHEN** el component ConfirmDeleteModal es renderitzat
- **THEN** mostra missatge de confirmacio i boto de cancel and confirm

#### Scenario: EventFormModal validates input
- **WHEN** l'usuari omple el formulari d'esdeveniment amb dades incompletes
- **THEN** mostra errors de validacio

#### Scenario: EventPreviewModal displays event
- **WHEN** el component rep dades d'un esdeveniment
- **THEN** mostra la informacio de l'esdeveniment correctament

#### Scenario: EventsList renders events
- **WHEN** el component rep una llista d'esdeveniments
- **THEN** mostra cada esdeveniment amb la seva informacio

#### Scenario: EventsList navigates to event
- **WHEN** l'usuari fa click a un esdeveniment
- **THEN** navega a la pagina de detall de l'esdeveniment

#### Scenario: EventsPreviewList shows preview
- **WHEN** el component rep una llista d'esdeveniments
- **THEN** mostra una previsualitzacio de cada un

#### Scenario: MobileSummaryDrawer toggles
- **WHEN** l'usuari fa click al boto de toggle
- **THEN** el drawer s'obre o es tanca correctament

#### Scenario: OrdersList displays orders
- **WHEN** el component rep una llista de comandes
- **THEN** mostra cada comanda amb el seu estat

#### Scenario: OrderSummaryPanel shows summary
- **WHEN** el component rep una comanda
- **THEN** mostra el resum de la comanda

#### Scenario: SeatLegend shows legend
- **WHEN** el component SeatLegend es renderitzat
- **THEN** mostra la llegenda de colors/zones

#### Scenario: SeatSelectionPanel allows selection
- **WHEN** l'usuari fa click a un seient disponible
- **THEN** el seient es selecciona i actualitza l'estat

#### Scenario: SeatZonesMap displays zones
- **WHEN** el component rep zones d'un espai
- **THEN** mostra el mapa de zones correctament

#### Scenario: SuccessModal displays message
- **WHEN** el component rep un missatge d'exit
- **THEN** mostra el missatge i boto per continuar