# Auth

Gestiona el registre, el login i la renovació de tokens JWT dels usuaris.

## Flux

1. `POST /auth/register` → crea un usuari amb la contrasenya hashejada (bcrypt)
2. `POST /auth/login` → valida les credencials i retorna access token + refresh token
3. `POST /auth/refresh` → verifica el refresh token i emet un nou parell de tokens
4. `GET /auth/me` → retorna les dades de l'usuari autenticat

## Fitxers clau

| Fitxer | Responsabilitat |
|---|---|
| `api/auth.controller.ts` | Exposa els 4 endpoints HTTP |
| `application/auth.service.ts` | Orquestra els use cases |
| `application/use-cases/login-user.use-case.ts` | Validació de credencials + signatura JWT |
| `application/use-cases/refresh-token.use-case.ts` | Verificació del refresh token + emissió de nous tokens |
| `api/guards/jwt-auth.guard.ts` | Protegeix rutes mitjançant Bearer token |

## Notes

- Els tokens es signen amb `JWT_SECRET` i `JWT_REFRESH_SECRET` del `.env`.
- El guard `JwtAuthGuard` s'aplica a tots els endpoints protegits de la resta de mòduls.
