# Users

Gestiona el perfil de l'usuari autenticat.

## Endpoints

| Mètode | Ruta | Descripció |
|---|---|---|
| `GET` | `/users/me` | Retorna id, username, email i data de registre |
| `PATCH` | `/users/me` | Actualitza username i/o email |

## Validacions de `PATCH /users/me`

- `username`: opcional, 1–50 caràcters, no buit.
- `email`: opcional, format email vàlid, no buit.
- Qualsevol camp omès no es modifica.

## Registre

El registre de nous usuaris el gestiona el mòdul `auth` mitjançant `RegisterUserUseCase`, que valida la unicitat d'email i username i hasheja la contrasenya amb bcrypt (10 rondes).
