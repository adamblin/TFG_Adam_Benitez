# Store (Zustand)

Estat global de l'aplicació gestionat amb Zustand. Cada store és independent i té un únic propòsit.

## Stores

| Store | Fitxer | Propòsit |
|---|---|---|
| `useAuthStore` | `auth.store.ts` | Sessió activa: tokens JWT i dades de l'usuari. Es buida en fer logout. |
| `useThemeStore` | `theme.store.ts` | Preferències visuals: paleta de colors activa i color de la icona d'avatar. |
| `useFocusSessionStore` | `focus-session.store.ts` | Indica si hi ha una sessió de focus activa i exposa la funció d'abort per a ús global. |
| `usePhraseModalStore` | `phrase-modal.store.ts` | Controla la visibilitat del modal de frases motivacionals. |
| `useStreakCelebrationStore` | `streak-celebration.store.ts` | Gestiona la celebració de ratxa diària amb persistència entre sessions. |

## Notes de persistència

- `useThemeStore` i `useAuthStore` no persisteixen en disc — es reinicien en recarregar l'app.
- `useStreakCelebrationStore` persisteix la data de l'última celebració usant `localStorage` al web i `AsyncStorage` en natiu (importat dinàmicament per compatibilitat web).
