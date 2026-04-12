# /opsx:propose
## foundation.md
Tinc aquest projecte que és una aplicació de compra d'entrades per concerts en una sala inventada. El projecte consisteix en un front amb Nuxt 4 que està construit amb arquitectura atòmica i dos backends, un laravel qui s'encarrega de la comunicació amb la base de dades utilitzant postregres i l'altre que es un node.js amb socket.io que implementa comunicació en temps real entre clients i laravel. Com a proposta, vull implementar una suite de testing de dues parts: La primera vull que siguin testing de front, provar que funcionen els organismes que he creat, que és el que les views utilitzen. Per altre banda, vull una altre suite de testing amb cypress que s'encarregui de fer un E2E que s'encarregui de provar la compra d'una entrada per a un concert. Tota aquesta informació anirà a un arxiu anomenat foundations.md a dins del folder /openspec.
Tens prohibit l'ús d'emojis i obviament, al executar-se cap mena de test, ha de quedar totalment net la infraestructura que s'utilitzi, ha de poder gestionar-se. En cas de necessitar models, es faràn MotherObjects.

## spec.md
Anirem a declarar l'arxiu spec.md on deixarem especificat el comportament esperat de la funcionalitat. Aquesta suites de testing han d'estar creades amb la finalitat de poder executar-se tant en CI/CD per al E2E i en local per al desenvolupament d'una nova funcionalitat. Han de quedar molt ben explicades amb comentaris que expliquin els processos per part. Per cada component organisme ha d'haver un arxiu de test per poder testejar unitariament cada component organisme. 

## plan.md
Anem a fer el plan.md per a recaudar l'estratègia d'implementació. El testing dels components estaran en la carpeta /tests diferenciats entre front i e2e. A dins de cada carpeta haurà una carpeta mothers. En cas d'existir 2 mother objetcs en cada carpeta, pasarà a una carpeta generica /shared/mothers.
Pels testos unitaris es necessitarà Jest i per altra banda els E2E serà per cypress.

