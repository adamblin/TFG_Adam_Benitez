# XP

Sistema de progressió de l'usuari: experiència, nivells i monedes.

## Endpoint

`GET /xp/me` → retorna nivell, XP total, XP en el nivell actual, progrés i monedes.

## Regles de progressió

- **Nivell**: cada 200 XP es puja un nivell (`nivell = ⌊XP_total / 200⌋ + 1`).
- **Daily bonus**: la primera acció productiva del dia atorga **10 monedes**.
- **Level-up bonus**: en pujar al nivell N s'atorguen **N monedes** addicionals.

## XP per acció

| Acció | XP |
|---|---|
| Completar subtasca | 20 |
| Completar tasca (auto) | 50 |
| Finalitzar sessió de focus | `durationMin × 2` |

## Monedes

Les monedes es gasten a la botiga (`ShopService.spendCoins`). Llança `400 BadRequest` si el saldo és insuficient.
