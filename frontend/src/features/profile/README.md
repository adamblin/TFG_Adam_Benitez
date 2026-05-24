# Feature: Profile

Pantalla de perfil de l'usuari amb resum de compte, estadístiques, ratxa i dashboard d'estadístiques complet.

## Seccions de la pantalla

| Secció | Component |
|---|---|
| Capçalera | `ProfileHeaderCard` (avatar, username, id, monedes) |
| Nivell i XP | `ProfileLevelCard` (barra de progrés cap al nivell següent) |
| Estadístiques ràpides | `ProfileStatsRow` (tasques, sessions, temps de focus) |
| Resum de compte | `ProfileAccountSummaryCard` (email, data de registre) |
| Sessions recents | `ProfileRecentSessionsCard` |
| Ratxa | `ProfileStreakCard` (ratxa actual, màxima i dies actius de la setmana) |
| Estadístiques completes | Reutilitza els components del mòdul `stats` |

## Hook principal

**`useProfileScreen`** — agrega dades de tasques, sessions i ratxa per calcular les estadístiques del perfil i les sessions recents.
