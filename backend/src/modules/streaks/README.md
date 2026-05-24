# Streaks

Calcula i persisteix la ratxa d'activitat diària de l'usuari.

## Endpoint

`GET /streaks/me` → retorna `currentStreak` i `longestStreak` de l'usuari autenticat.

## Lògica de ratxa (`recordActivity`)

| Situació | Resultat |
|---|---|
| Primera activitat de l'usuari | Ratxa = 1, `isNewRecord: true` |
| Ja hi ha hagut activitat avui | Idempotent, no modifica res |
| Última activitat va ser ahir | Ratxa += 1 |
| Última activitat fa >1 dia | Ratxa es reinicia a 1 |
| Nova ratxa supera el màxim històric | `isNewRecord: true` |

## Qui crida `recordActivity`

- `UpdateTaskUseCase` — en completar una tasca manualment.
- `UpdateSubtaskUseCase` — en completar una subtasca.
- `EndSessionUseCase` — en finalitzar una sessió de concentració completada.
