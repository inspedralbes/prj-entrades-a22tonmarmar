## ADDED Requirements

### Requirement: useBookingStore tests SHALL pass
La store useBookingStore HAN DE tenir tests que validin tot el seu comportament.

#### Scenario: Store initializes with empty state
- **WHEN** s'inicialitza la store
- **THEN** l'estat inicial te tickets buit, selectedEvent null i total 0

#### Scenario: Store adds ticket
- **WHEN** s'afegeix un ticket mitjancant addTicket
- **THEN** el ticket apareix a l'estat i el total s'actualitza

#### Scenario: Store removes ticket
- **WHEN** s'elimina un ticket mitjancant removeTicket
- **THEN** el ticket desapareix de l'estat i el total s'actualitza

#### Scenario: Store clears all tickets
- **WHEN** s'executa clearTickets
- **THEN** l'estat de tickets es buida i el total torna a 0

#### Scenario: Store sets event
- **WHEN** s'estableix un event mitjancant setEvent
- **THEN** selectedEvent conte l'event seleccionat

#### Scenario: Store calculates total correctly
- **WHEN** s'afegeixen multiples tickets
- **THEN** el getter total calcula la suma correctament

#### Scenario: Store getter hasSelectedTickets
- **WHEN** no hi ha tickets seleccionats
- **THEN** el getter hasSelectedTickets retorna false

- **WHEN** hi ha tickets seleccionats
- **THEN** el getter hasSelectedTickets retorna true

### Requirement: auth store tests SHALL pass
La store auth HAN DE tenir tests que validin el seu comportament.

#### Scenario: Auth store initializes logged out
- **WHEN** s'inicialitza la store
- **THEN** isAuthenticated es false i user es null

#### Scenario: Auth store login
- **WHEN** s'executa login amb credencials valides
- **THEN** isAuthenticated es true i user conte les dades

#### Scenario: Auth store logout
- **WHEN** s'executa logout
- **THEN** isAuthenticated es false i user es null

#### Scenario: Auth store getter isAdmin
- **WHEN** l'usuari no es admin
- **THEN** el getter isAdmin retorna false

- **WHEN** l'usuari es admin
- **THEN** el getter isAdmin retorna true