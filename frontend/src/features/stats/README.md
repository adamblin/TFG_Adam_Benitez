# Feature: Stats

Dashboard d'estadístiques de productivitat amb vistes setmanal, mensual i anual.

## Vistes

| Període | Component | Descripció |
|---|---|---|
| `weekly` | `RadialWeekChart` | Gràfica radial amb minuts de focus per dia de la setmana |
| `monthly` | `MonthlyCalendarCard` | Calendari navegable amb dies actius marcats |
| `annual` | `AnnualCalendarHeatmap` + `BarChartCard` | Heatmap d'activitat + gràfiques de barres mensuals |

## Hook principal

**`useStatsDashboard`** — calcula tots els KPIs, sèries de dades i estructures de calendari a partir de les sessions de focus, tasques i ratxa de l'usuari. Suporta navegació de mesos cap enrere (sense poder avançar més enllà del mes actual).

## KPIs calculats

- Temps total de focus (hores)
- Sessions completades
- Tasques completades
- Subtasques completades
- Millor dia (dia amb més minuts de focus)
- Dies actius
