# Tasks

CRUD de tasques de l'usuari i descomposició automàtica amb IA.

## Endpoints

| Mètode | Ruta | Descripció |
|---|---|---|
| `GET` | `/tasks/me` | Llista totes les tasques de l'usuari amb subtasques aniuades |
| `POST` | `/tasks` | Crea una tasca (títol buit → "Nueva tarea") |
| `GET` | `/tasks/:id` | Obté una tasca per id |
| `PATCH` | `/tasks/:id` | Actualitza títol, descripció, estat o data de lliurament |
| `DELETE` | `/tasks/:id` | Elimina la tasca i les seves subtasques |
| `POST` | `/tasks/breakdown` | Descompon una descripció en nom + subtasques usant Gemini IA |

## Fitxers clau

| Fitxer | Responsabilitat |
|---|---|
| `application/use-cases/breakdown-task.use-case.ts` | Crida Gemini 2.5 Flash Lite per generar subtasques |
| `application/use-cases/update-task.use-case.ts` | En completar una tasca registra activitat de ratxa |

## Notes

- L'endpoint `/tasks/breakdown` requereix `GEMINI_API_KEY` al `.env`. Si la quota s'esgota llança `503 ServiceUnavailable`.
- Marcar una tasca com a completada dispara `StreaksService.recordActivity`.
