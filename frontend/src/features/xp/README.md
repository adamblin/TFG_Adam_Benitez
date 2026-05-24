# Feature: XP

Mostra el nivell de progressió de l'usuari i les seves monedes disponibles.

## Hook

**`useUserXP`** — query que retorna `level`, `xpInLevel`, `xpToNextLevel`, `progressPercent`, `totalXp` i `coins`.

## Ús a l'app

- `ProfileLevelCard` usa aquest hook per mostrar la barra de progrés de nivell.
- `ProfileHeaderCard` mostra el saldo de monedes.
- `useShop` invalida la query de XP després de cada compra per actualitzar el saldo visible.
