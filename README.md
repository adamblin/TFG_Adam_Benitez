# TFG: Disseny funcional i tècnic d'un sistema digital per reduir la procrastinació acadèmica

> Arquitectura moderna, escalable i modular per a un sistema digital que redueix la procrastinació acadèmica.

## Stack

| Capa | Tecnologia |
|------|-----------|
| **Frontend** | React Native (Expo 54) + TypeScript |
| **Backend** | NestJS 11 + TypeScript |
| **Base de dades** | PostgreSQL 16 + Prisma ORM |
| **CI/CD** | GitHub Actions |
| **DevOps** | Docker Compose |

## Inici ràpid

### Instal·lació

```bash
# Totes les dependències
npm install

# Afegir variables d'entorn
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Desenvolupament

```bash
# Tot (backend + frontend)
npm run start:all

# Per separat
cd backend && npm run start:dev     # http://localhost:3000
cd frontend && npm run start         # Expo
```

### Validació

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run test:e2e      # Tests E2E
```

## Arquitectura

### Visió general

El sistema segueix una arquitectura **per capes amb patró modular**:

```
┌─────────────────────┐
│   React Native      │
│   (Frontend)        │
└──────────┬──────────┘
           │ API REST
┌──────────▼──────────┐
│      NestJS         │
│   (Controllers)     │
│   (Services)        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Domain Entities    │
│  (Business Logic)   │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Prisma ORM        │
│   (Repository)      │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   PostgreSQL        │
│   (Base de dades)   │
└─────────────────────┘
```

### Backend

**Estructura**:

```
src/
├── infrastructure/
│   ├── prisma/
│   │   ├── prisma.module.ts      # Prisma configuration
│   │   └── prisma.service.ts     # Database service
│   └── passport/                 # JWT estratègia
├── modules/
│   ├── auth/                      # Autenticació
│   │   ├── api/                   # Controllers, DTOs, Guards
│   │   ├── application/           # Services, Use cases
│   │   ├── domain/                # Entities, Interfaces
│   │   └── infrastructure/        # Passport estratègies
│   ├── users/                     # Gestió d'usuaris
│   ├── tasks/                     # Tasques i estudi
│   ├── subtasks/                  # Subtasques
│   ├── focus/                     # Sessions de focus
│   ├── focus-sessions/            # Registre de sessions
│   └── streaks/                   # Rachas d'estudi
├── app.module.ts                  # Mòdul arrel
├── app.controller.ts
├── app.service.ts
└── main.ts                        # Bootstrap + Swagger
```

**Per cadascun dels mòduls**:

```
module/
├── api/                   # Controllers, DTOs, Guards
├── application/           # Services, Use cases
├── domain/                # Entities, Interfaces
└── infrastructure/        # Repositories, Mappers
```

### Frontend

**Estructura**:

```
app/                    # Enrutament (Expo Router)
├── _layout.tsx         # Layout principal
├── index.tsx           # Home
├── tasks/              # Pantalla de tasques
└── ...

src/
├── features/           # Per característica
│   ├── auth/          # components, hooks, types
│   ├── tasks/         # components, detail, hooks, types
│   ├── focus/
│   ├── streaks/
│   ├── weekly/
│   ├── profile/
│   └── ...
├── services/           # API client
├── shared/             # Componentes reutilitzables
│   ├── components/    # UI components
│   ├── hooks/         # Hooks compartits
│   ├── theme/         # Design tokens
│   └── types/         # Types globals
└── store/              # Gestió d'estat global
```

### Principis de disseny

- **Per capes**: Separació clara entre UI, negoci i persistència
- **Modular**: Cada feature és independent i reutilitzable
- **TypeScript strict**: Type safety al màxim
- **JWT stateless**: Autenticació sense sessions del servidor
- **Documentation-first**: Swagger autòmat per a tota l'API
- **DRY**: No repetir codi; abstraccions compartides en `/shared`
- **Testing**: E2E tests per a casos crítics
- **CI/CD**: Validació automàtica en cada PR

### Base de dades

Prisma ORM amb PostgreSQL:

```prisma
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  username  String  @unique
  // relacions...
}
```

## Docs addicionals

- **API Docs** — Swagger en viu: `http://localhost:3000/api/docs`
- **CI/CD** — [GitHub Actions](./.github/WORKFLOWS.md)

---

Aquesta arquitectura es manté **viva**: s'evoluciona amb cada nova característica implementada.# Disseny funcional i tècnic d’un sistema digital perreduir la procrastinació acadèmica en estudiants

## Introducció

Aquest repositori conté la implementació tècnica del MVP del TFG. Consisteix en un sistema digital orientat a reduir la procrastinació acadèmica a partir d'una arquitectura moderna, escalable i modular. 


## Arquitectura

El sistema segueix una arquitectura **Monolítica per capes**:

Frontend (React Native) --> API REST (NestJS) --> Application Layer (Use Cases) --> Domain Layer (Entities) --> Persistance Layer (Prisma ORM) --> PostgreSQL


## Stack tecnològic

### Frontend
- React Native (Expo 54)
- TypeScript
- Expo Router

### Backend
- NestJS 11
- TypeScript
- Prisma ORM 6
- PostgreSQL

### Infraestructura
- Docker Compose
- Node.js


## Estructura del projecte

### Backend (`/backend/src`)

```
src/
├── infrastructure/
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

### Frontend (`/frontend`)

```
app/
├── _layout.tsx
└── index.tsx

src/
├── services/
├── shared/
└── store/
```

### Estructura General

```
.
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── scripts/
│   ├── start-all.js
│   ├── stop-all.js
│   └── smoke-test.js
├── docker-compose.yml
└── package.json
```


## Documentació API - Swagger

L'API REST està completament documentada amb Swagger/OpenAPI.

### Accedir a Swagger

Un cop el servidor está corrent:

```bash
npm run start:dev  # backend
```

Obrir: **http://localhost:3000/api/docs**

### Funcionalitats

- Visualitzar tots els endpoints disponibles
- Autenticació per Bearer Token (JWT)
- Provar requests directament des de la UI
- Documentació automàtica dels DTOs
- Exemples de resposta

### Decoradores Swagger

Els endpoints usen decoradores estàndard:

```typescript
@Post('login')
@ApiOperation({ summary: 'Iniciar sesió' })
@ApiOkResponse({ type: LoginResponseDto })
async login(@Body() dto: LoginUserDto) {
  return this.authService.login(dto);
}
```


## CI/CD - GitHub Actions

El projecte té automació completa amb GitHub Actions.

### Workflows

#### Frontend - Type-check and Lint

**Fitxer**: `.github/workflows/front-fail-check.yml`

**Dispara**: `pull_request` a `main` o `dev`

**Passos**:
1. Checkout del codi
2. Setup de Node.js 18
3. Instal·lació de dependències (`npm ci`)
4. ESLint + Prettier check
5. TypeScript type-check

```bash
npm run lint      # Valida sense modificar
npm run lint:fix  # Corregeix errors (local only)
npm run typecheck # TypeScript strict check
```

#### Backend - Lint and Build

**Fitxer**: `.github/workflows/back-fail-check copy.yml`

**Dispara**: `pull_request` a `main` o `dev`

**Passos**:
1. Checkout del codi
2. Setup de Node.js 18 amb caché npm
3. Instal·lació de dependències
4. ESLint check
5. NestJS build

```bash
npm run lint  # ESLint stricte
npm run build # Compilació TypeScript
```

#### Backend - E2E Tests

**Fitxer**: `.github/workflows/backend-e2e-tests.yml`

**Dispara**: `pull_request` a `main` o `dev` només si canvia `backend/`

**Passos**:
1. Checkout del codi
2. Setup de Node.js 18
3. Servei PostgreSQL (Docker)
4. Instal·lació de dependències
5. Generació de Prisma client
6. Aplicació de migracions
7. Execució de tests e2e

```bash
npm run test:e2e  # Endpoint integration tests
```

### Local - Simular CI

Per provar els mateixos comandos que corre CI en local:

```bash
# Frontend
cd frontend
npm run lint
npm run typecheck

# Backend
cd backend
npm run lint
npm run build
npm run test:e2e  # Requereix PostgreSQL en Docker
```

### Configuració d'Actions

- **Node.js version**: 18 (compatible amb Node 24)
- **Caché npm**: Activada per optimització de velocitat
- **Prisma**: Generat automàticament en e2e
- **PostgreSQL**: Servei temporalment levantada en e2e amb health check


## Autenticació

Sistema basat en:
- JWT (access token)
- Passport strategy (nestjs/passport)

Flux:
1. Login/Register
2. Generació JWT
3. Validació en cada request


## Principis d’arquitectura

- Separació estricta per capes
- Dependency inversion (services → repositories)
- DTOs per comunicació externa
- Domain independent del framework
- Stateless backend


## Flux de dades


1. UI fa request (React Native)
2. TanStack Query gestiona cache
3. API (NestJS Controller)
4. Service (Use Case)
5. Repository (Prisma)
6. DB (PostgreSQL)
