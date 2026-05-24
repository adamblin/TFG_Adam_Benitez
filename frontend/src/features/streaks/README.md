# Feature: Streaks

Pantalla de seguiment de ratxes diàries i assoliments de consistència.

## Components principals

| Component | Descripció |
|---|---|
| `StreakHeaderCard` | Mostra la ratxa actual en dies amb animació de flama |
| `WeekProgressRow` | 7 cercles que indiquen quins dies de la setmana hi ha hagut activitat |
| `MonthProgressGrid` | Graella mensual amb dies actius marcats |
| `AchievementCard` | Assoliment desbloquejat/bloquejat segons el `longestStreak` |

## Assoliments

| Assoliment | Requisit |
|---|---|
| First streak | `longestStreak ≥ 3` |
| A full week | `longestStreak ≥ 7` |
| Consistency | `longestStreak ≥ 14` |
| Habit formed | `longestStreak ≥ 30` |

## Hook

**`useStreak`** — query simple que retorna `currentStreak` i `longestStreak` de l'usuari.
