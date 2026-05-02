# GitHub Actions Workflows

## Frontend - Lint + Type-check

**Fitxer**: `.github/workflows/front-fail-check.yml`

- Activa: `pull_request` a `main` o `dev`
- Scripts: `npm run lint`, `npm run typecheck`

## Backend - Lint + Build

**Fitxer**: `.github/workflows/back-fail-check copy.yml`

- Activa: `pull_request` a `main` o `dev`
- Scripts: `npm run lint`, `npm run build`

## Backend - E2E Tests

**Fitxer**: `.github/workflows/backend-e2e-tests.yml`

- Activa: `pull_request` a `main` o `dev` (si canvia `backend/`)
- Serveis: PostgreSQL 16
- Scripts: `npm run test:e2e`

---

