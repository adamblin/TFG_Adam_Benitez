# Disseny funcional i tècnic d’un sistema digital perreduir la procrastinació acadèmica en estudiants

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
