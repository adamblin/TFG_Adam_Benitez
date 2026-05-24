# Feature: Stuck (Safe Mode)

Pantalla d'emergència per a moments de saturació acadèmica. Mostra només les tasques més urgents i el nivell d'estrès actual.

## Propòsit

Reduir la paràlisi per anàlisi mostrant únicament les 3 tasques de major risc i ocultant la resta. L'usuari pot expandir la llista completa si ho desitja.

## Algorisme d'estrès (`computeStress`)

Pondera les tasques pendents: tasques de risc alt valen 3 punts, les de risc mitjà 1.
El percentatge es normalitza sobre el màxim possible (totes les tasques en risc alt).

| Percentatge | Nivell | Color |
|---|---|---|
| ≥ 50% | high | vermell |
| 20–49% | moderate | groc |
| < 20% | low | verd |

## Algorisme de risc de tasca

Definit a `shared/utils/taskRisk.ts`. Combina dies fins a la data de lliurament i nombre de subtasques pendents per assignar risc `high`, `medium` o `low`.
