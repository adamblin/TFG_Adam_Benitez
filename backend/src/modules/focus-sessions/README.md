# Focus Sessions

Gestiona el cicle de vida de les sessions de concentració (pomodoro lliure).

## Flux

1. `POST /focus-sessions/start` → crea una sessió activa (tanca l'anterior si n'hi ha)
2. `POST /focus-sessions/end` → marca la sessió com a finalitzada
   - Si `completed: true`: atorga XP (2 × minuts), actualitza la ratxa i genera un missatge motivacional
3. `GET /focus-sessions/sessions` → llista totes les sessions de l'usuari

## Fitxers clau

| Fitxer | Responsabilitat |
|---|---|
| `api/focus-sessions.controller.ts` | Endpoints HTTP |
| `application/use-cases/start-session.use-case.ts` | Tanca la sessió activa prèvia i crea la nova |
| `application/use-cases/end-session.use-case.ts` | Finalitza la sessió, atorga XP i actualitza la ratxa |
| `application/use-cases/list-sessions.use-case.ts` | Recupera l'historial de sessions |

## Notes

- Només pot haver-hi una sessió activa per usuari simultàniament.
- L'XP atorgat és `durationMin × 2`.
