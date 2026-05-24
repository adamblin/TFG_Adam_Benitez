# Feature: Focus

Pantalla i lògica del temporitzador de sessions de concentració.

## Components principals

| Component | Descripció |
|---|---|
| `FocusTimerCard` | Mostra el temporitzador circular i els controls d'inici/pausa/stop |
| `TaskAccordionSelector` | Llista de tasques per associar a la sessió activa |

## Hook principal

**`useFocusSession`** — gestiona:
- Temporitzador regressiu amb pausa i represa.
- Detecció d'app en segon pla (pausa automàtica via `AppState`).
- Crides a l'API d'inici/fi de sessió.
- En completar: mostra celebració de ratxa o frase motivacional.

## Notes

- L'estat de sessió activa es comparteix globalment mitjançant `useFocusSessionStore` perquè altres pantalles puguin avortar la sessió si cal.
- Una sessió incompleta (stop abans d'hora) no atorga XP ni actualitza la ratxa.
