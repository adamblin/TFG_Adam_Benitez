# Feature: Shop

Botiga on l'usuari gasta monedes per personalitzar l'aparença de l'app.

## Ítems disponibles

- **Colors d'icona d'avatar**: 34 colors de raresa common → legendary.
- **Temes d'app**: 20 temes de color de raresa common → legendary.

## Hooks

| Hook | Descripció |
|---|---|
| `useShopCatalog` | Carrega el catàleg amb estat owned/equipped |
| `usePreferences` | Carrega les preferències actives i les aplica al `useThemeStore` |
| `usePurchaseItem` | Compra un ítem; invalida catàleg i XP després de la compra |
| `useEquipItem` | Equipa un ítem; actualitza el `useThemeStore` immediatament |

## Notes

- Els ítems de raresa `common` (preu 0) estan sempre disponibles sense compra.
- El tema actiu s'aplica globalment mitjançant `useThemeStore`, que resol la paleta de colors usada per tots els components.
