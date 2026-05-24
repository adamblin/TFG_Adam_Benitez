# Shop

Botiga d'ítems cosmètics (colors d'icona i temes d'app) comprats amb monedes.

## Endpoints

| Mètode | Ruta | Descripció |
|---|---|---|
| `GET` | `/shop/catalog` | Catàleg complet amb estat owned/equipped per usuari |
| `GET` | `/shop/preferences` | Preferències visuals actives de l'usuari |
| `POST` | `/shop/purchase` | Compra un ítem amb monedes |
| `POST` | `/shop/equip` | Equipa un ítem ja comprat |

## Catàleg

Definit de forma estàtica a `application/shop.catalog.ts`. Els ítems comuns (`price: 0`) són gratuïts i sempre disponibles. Els preus per raresa són:

| Raresa | Preu |
|---|---|
| common | 0 |
| uncommon | 20 |
| rare | 50 |
| epic | 100 |
| legendary | 200 |

## Notes

- Intentar comprar un ítem gratuït o un ja comprat llança `400 BadRequest`.
- L'estat owned/equipped es calcula dinàmicament en cada petició al catàleg.
