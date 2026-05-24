# Feature: Auth

Pantalla de login/registre i lògica d'autenticació de l'usuari.

## Components principals

| Component | Descripció |
|---|---|
| `LoginForm` | Formulari unificat que alterna entre mode login i registre |
| `FormHeader` | Capçalera amb títol i subtítol segons el mode actiu |
| `FormModeSwitcher` | Pestanyes per canviar entre login i registre |

## Hook principal

**`useLoginForm`** — gestiona l'estat del formulari, crida l'API i navega a `/` després d'autenticar-se correctament. Escriu el token i les dades de l'usuari a `useAuthStore`.

## Notes

- La pantalla `/auth` és l'arrel de l'app quan no hi ha sessió activa. El layout redirigeix automàticament a ella si no hi ha token.
- El token s'emmagatzema en memòria (Zustand), no en disc — es perd en reiniciar l'app.
