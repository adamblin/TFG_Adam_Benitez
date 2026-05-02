# Arquitectura

## Visió general

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

## Backend

### Estructura de carpetes

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

### Per cadascun dels mòduls

```
module/
├── api/
│   ├── dto/                       # Data Transfer Objects
│   ├── controllers/               # Endpoints HTTP
│   ├── guards/                    # Validació de JWT
│   └── interceptors/              # Processament de resposta
├── application/
│   └── services/                  # Cases d'ús i lògica
├── domain/
│   ├── entities/                  # Models de negoci
│   └── interfaces/                # Contracts
└── infrastructure/
    ├── repositories/              # Accés a DB via Prisma
    └── mappers/                   # DTO <-> Entity
```

## Frontend

### Estructura de carpetes

```
app/
├── _layout.tsx                    # Layout principal
├── index.tsx                      # Home
├── tasks/                         # Pantalla de tasques
└── ...

src/
├── features/
│   ├── auth/
│   │   ├── components/           # UI components
│   │   ├── hooks/                # useLogin, useRegister
│   │   └── types/                # Types locals
│   ├── tasks/
│   │   ├── components/
│   │   ├── detail/
│   │   ├── hooks/
│   │   └── types/
│   ├── focus/
│   ├── streaks/
│   ├── weekly/
│   ├── profile/
│   └── ...
├── services/
│   └── api/                       # Client HTTP
├── shared/
│   ├── components/               # Componentes reutilitzables
│   ├── hooks/                    # useLocalStorage, etc
│   ├── theme/                    # Colors, tipografia
│   └── types/                    # Types globals
└── store/                        # Gestió d'estat global
```

## Principis de disseny

- **Per capes**: Separació clara entre UI, negoci i persistència
- **Modular**: Cada feature és independent i reutilitzable
- **TypeScript strict**: Type safety al màxim
- **JWT stateless**: Autenticació sense sessions del servidor
- **Documentation-first**: Swagger autòmat per a tota l'API
- **DRY**: No repetir codi; abstraccions compartides en `/shared`
- **Testing**: E2E tests per a casos crítics
- **CI/CD**: Validació automàtica en cada PR

## Base de dades

Prisma ORM amb PostgreSQL:

```prisma
// Exemple
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  username  String  @unique
  // relacions...
}
```

---

Aquesta arquitectura es manté **viva**: s'evoluciona amb cada nova caraterística implementada.