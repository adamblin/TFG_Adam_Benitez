# Subtasks

CRUD de subtasques associades a tasques de l'usuari.

## Endpoints

| Mètode | Ruta | Descripció |
|---|---|---|
| `POST` | `/subtasks` | Crea una subtasca per a una tasca existent |
| `GET` | `/subtasks/task/:taskId` | Llista subtasques d'una tasca |
| `GET` | `/subtasks/:id` | Obté una subtasca per id |
| `PATCH` | `/subtasks/:id` | Actualitza títol, estat o ordre |
| `DELETE` | `/subtasks/:id` | Elimina una subtasca |

## Comportament en completar

En marcar una subtasca com a completada (`completed: true`):

1. S'atorguen **20 XP** a l'usuari.
2. Es registra activitat de ratxa (`StreaksService.recordActivity`).
3. Si **totes** les subtasques de la tasca pare queden completades, la tasca es marca automàticament com a completada i s'atorguen **50 XP** addicionals.
