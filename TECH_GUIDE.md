# Guía Técnica de Aprendizaje — TFG Anti-Procrastinación

> **Objetivo:** Comprender en profundidad cada tecnología, patrón y decisión de diseño del stack, de forma que puedas reproducir la arquitectura completa en un proyecto de práctica y explicarla con precisión durante la defensa.

---

## Tabla de contenidos

1. [Visión global del sistema](#1-visión-global-del-sistema)
2. [Monorepo con npm Workspaces](#2-monorepo-con-npm-workspaces)
3. [Contenedorización con Docker Compose](#3-contenedorización-con-docker-compose)
4. [Capa de datos: PostgreSQL + Prisma ORM](#4-capa-de-datos-postgresql--prisma-orm)
5. [Backend: NestJS y su sistema de módulos](#5-backend-nestjs-y-su-sistema-de-módulos)
6. [Arquitectura limpia en el backend](#6-arquitectura-limpia-en-el-backend)
7. [Autenticación JWT con Passport](#7-autenticación-jwt-con-passport)
8. [DTOs, validación y Swagger](#8-dtos-validación-y-swagger)
9. [Integración de IA (Google Gemini)](#9-integración-de-ia-google-gemini)
10. [CI/CD con GitHub Actions](#10-cicd-con-github-actions)
11. [Frontend: React Native y Expo](#11-frontend-react-native-y-expo)
12. [Enrutamiento: Expo Router](#12-enrutamiento-expo-router)
13. [Estado del servidor: TanStack React Query](#13-estado-del-servidor-tanstack-react-query)
14. [Estado global del cliente: Zustand](#14-estado-global-del-cliente-zustand)
15. [Cliente HTTP: el patrón api.client.ts](#15-cliente-http-el-patrón-apiclientts)
16. [Sistema de temas y design tokens](#16-sistema-de-temas-y-design-tokens)
17. [Estructura por features en el frontend](#17-estructura-por-features-en-el-frontend)
18. [Flujo completo de datos extremo a extremo](#18-flujo-completo-de-datos-extremo-a-extremo)
19. [Preguntas frecuentes de defensa](#19-preguntas-frecuentes-de-defensa)

---

## 1. Visión global del sistema

### ¿Qué construiste?

Una aplicación full-stack de gestión de productividad con tres grandes responsabilidades:

| Área | Responsabilidad |
|------|-----------------|
| **Gestión de tareas** | CRUD de tareas y subtareas, fechas de vencimiento |
| **Sesiones de foco** | Temporizador Pomodoro con vinculación a tareas |
| **Gamificación** | Rachas, XP, monedas, inventario, tienda de temas |

### Diagrama conceptual del stack

```
┌─────────────────────────────────────────┐
│           React Native (Expo 54)        │  ← Móvil (Android/iOS/Web)
│   Expo Router · TanStack Query · Zustand│
└──────────────────┬──────────────────────┘
                   │ HTTP/REST (JSON)
                   │ Bearer Token (JWT)
┌──────────────────▼──────────────────────┐
│              NestJS 11                  │  ← Puerto 3000
│  Controllers · Services · Use Cases     │
│  Passport JWT · Swagger/OpenAPI         │
└──────────────────┬──────────────────────┘
                   │ Prisma Client (ORM)
┌──────────────────▼──────────────────────┐
│           PostgreSQL 16                 │  ← Puerto 5432
│        (Docker Compose en dev)          │
└─────────────────────────────────────────┘
```

### Por qué este stack y no otro

- **TypeScript en ambos lados**: un solo lenguaje en todo el proyecto elimina la fricción cognitiva. Los tipos del backend se pueden replicar en el frontend.
- **NestJS vs Express puro**: NestJS impone estructura. Express es flexible pero sin convenciones — en un proyecto académico con arquitectura limpia, NestJS encaja mejor.
- **React Native vs Flutter**: TypeScript ya se usa en el backend. Mantener el mismo ecosistema reduce la curva de aprendizaje.
- **PostgreSQL vs MongoDB**: El dominio (tareas, usuarios, sesiones) tiene relaciones claras y esquema predecible. SQL con relaciones es más apropiado que documentos NoSQL.

---

## 2. Monorepo con npm Workspaces

### ¿Qué es un monorepo?

Un repositorio Git que contiene múltiples paquetes/proyectos relacionados. Alternativa a tener un repositorio por servicio.

### Por qué se eligió

- El backend y el frontend son parte del mismo TFG, se desarrollan en paralelo.
- Permite ejecutar ambos con un solo comando (`npm run start:all`).
- Una sola configuración de ESLint/TypeScript en la raíz puede compartirse.

### Cómo funciona en este proyecto

**`package.json` raíz:**
```json
{
  "name": "tfg-adam-benitez",
  "private": true,
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "start:all": "node scripts/start-all.js",
    "stop:all":  "node scripts/stop-all.js",
    "smoke:test": "node scripts/smoke-test.js"
  }
}
```

La clave es `"workspaces": ["backend", "frontend"]`. Esto le dice a npm:
- Trata `backend/` y `frontend/` como paquetes independientes.
- Cuando ejecutas `npm install` en la raíz, instala las dependencias de ambos.
- Los scripts de cada workspace se ejecutan desde su propio directorio.

### Regla práctica

`npm install` siempre desde la raíz. Para comandos específicos: `cd backend && npm run ...`.

---

## 3. Contenedorización con Docker Compose

### El problema que resuelve

Instalar PostgreSQL localmente requiere configuración específica de cada sistema operativo. Docker elimina ese problema encapsulando la base de datos en un contenedor con configuración reproducible.

### `docker-compose.yml` comentado

```yaml
services:
  postgres:
    image: postgres:16          # Versión exacta → reproducibilidad
    container_name: toolboard-postgres
    environment:
      POSTGRES_USER: toolboard
      POSTGRES_PASSWORD: toolboard
      POSTGRES_DB: toolboard
    ports:
      - "5432:5432"             # host:contenedor — expone DB al host
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persistencia entre reinicios

volumes:
  postgres_data:                # Volumen nombrado — los datos sobreviven a `docker-compose down`
```

### Comandos esenciales

```bash
docker-compose up -d      # Iniciar en background
docker-compose down       # Parar (datos persisten en el volumen)
docker-compose down -v    # Parar Y borrar datos (reset total)
docker-compose logs -f    # Ver logs en tiempo real
```

### Solo en desarrollo

En producción no usarías Docker Compose — usarías un servicio gestionado de PostgreSQL (AWS RDS, Supabase, etc.). Docker Compose es una herramienta de desarrollo local.

---

## 4. Capa de datos: PostgreSQL + Prisma ORM

### ¿Por qué un ORM?

Sin ORM escribirías SQL crudo:
```typescript
// Sin ORM
const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
```

Con Prisma:
```typescript
// Con Prisma
const tasks = await prisma.task.findMany({ where: { userId } });
```

Ventajas del ORM:
- **Tipado automático**: Prisma genera los tipos TypeScript a partir del schema.
- **Migraciones**: los cambios al schema se versionan y aplican ordenadamente.
- **Seguridad**: no hay interpolación de strings → no hay SQL injection.

### El schema de Prisma como única fuente de verdad

`backend/prisma/schema.prisma` es el contrato de la base de datos. Todo lo demás se deriva de él.

```prisma
// Indica qué cliente generar
generator client {
  provider = "prisma-client-js"
}

// Configura la conexión (lee DATABASE_URL del .env)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Modelos principales y sus relaciones

```prisma
model User {
  id            String           @id @default(cuid()) // cuid = ID distribuido sin colisiones
  email         String           @unique
  username      String           @unique
  passwordHash  String           @map("password_hash") // columna DB = password_hash, campo TS = passwordHash
  refreshTokens RefreshToken[]   // relación 1:N
  tasks         Task[]
  focusSessions FocusSession[]
  streak        Streak?          // relación 1:1 opcional
  userXP        UserXP?
  @@map("users")                 // nombre real de la tabla en DB
}

model Task {
  id          String       @id @default(cuid())
  title       String
  completed   Boolean      @default(false)
  dueDate     DateTime?    // ? = nullable
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  subtasks    Subtask[]
  @@map("tasks")
}
```

**Puntos clave a explicar en la defensa:**
- `@default(cuid())`: genera IDs únicos sin necesidad de autoincrement de DB. Útil en sistemas distribuidos.
- `@map(...)` y `@@map(...)`: desacopla los nombres de los campos TypeScript de los nombres de columnas SQL.
- `onDelete: Cascade`: cuando se borra un User, se borran en cascada todos sus Tasks. Integridad referencial en la DB.
- `?` (nullable): el campo puede ser NULL en la DB. Prisma lo expresa como `DateTime | null` en TypeScript.

### Flujo de migraciones

```
1. Editas schema.prisma
         ↓
2. npx prisma migrate dev --name "add_subtasks"
         ↓
3. Prisma genera SQL en prisma/migrations/TIMESTAMP_add_subtasks/migration.sql
         ↓
4. Prisma aplica el SQL a tu DB local
         ↓
5. Prisma regenera el cliente TypeScript (tipos actualizados)
```

En CI/CD se usa `prisma migrate deploy` (no `dev`) porque es determinístico y no interactivo.

### PrismaService: cómo se integra en NestJS

```typescript
// backend/src/infrastructure/prisma/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // conecta al iniciar el módulo
  }
  async onModuleDestroy() {
    await this.$disconnect(); // limpia al apagar
  }
}
```

`PrismaService` extiende `PrismaClient` directamente. Esto significa que `prismaService.task.findMany(...)` funciona igual que `prismaClient.task.findMany(...)`.

```typescript
// backend/src/infrastructure/prisma/prisma.module.ts
@Global()  // hace que PrismaService esté disponible en TODA la app sin importarlo módulo a módulo
@Module({
  providers: [PrismaService],
  exports:   [PrismaService],
})
export class PrismaModule {}
```

---

## 5. Backend: NestJS y su sistema de módulos

### ¿Qué es NestJS?

Un framework de Node.js que añade estructura sobre Express. Usa decoradores de TypeScript para describir el comportamiento. Está inspirado en Angular.

### Decoradores fundamentales

```typescript
@Module({ ... })      // Declara un módulo (grupo de componentes relacionados)
@Injectable()         // Marca una clase como inyectable (gestionada por el DI container)
@Controller('ruta')   // Define un controlador HTTP
@Get(), @Post(), @Patch(), @Delete()  // Métodos HTTP
@Body(), @Param(), @Req()             // Parámetros del handler
@UseGuards(Guard)     // Aplica un guard (ej: autenticación)
```

### Inversión de Dependencias (DI) en NestJS

En lugar de crear instancias manualmente:
```typescript
// MAL — acoplamiento duro
class AuthService {
  constructor() {
    this.usersRepo = new UsersRepository(); // instancia manual
  }
}
```

NestJS lo gestiona:
```typescript
// BIEN — inyección de dependencias
@Injectable()
class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository, // NestJS inyecta esto
    private readonly jwtService: JwtService,      // NestJS inyecta esto
  ) {}
}
```

**¿Por qué importa?** El DI container de NestJS:
1. Crea una sola instancia de cada servicio (Singleton por defecto).
2. Resuelve el grafo de dependencias automáticamente.
3. Facilita los tests: puedes sustituir `UsersRepository` por un mock fácilmente.

### El módulo raíz

```typescript
// backend/src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env disponible en toda la app
    PrismaModule,                              // DB
    AuthModule,
    TasksModule,
    SubtasksModule,
    FocusSessionsModule,
    StreaksModule,
    XPModule,
    ShopModule,
    MotivationalPhrasesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
```

Cada módulo feature encapsula su propio controlador, servicio, casos de uso y repositorios. El módulo raíz solo los ensambla.

### Bootstrap en `main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite peticiones desde el frontend (origen diferente)
  app.enableCors();

  // ValidationPipe global: aplica class-validator en todos los DTOs
  // transform: true → convierte strings a tipos (ej: "2024-01-01" → Date)
  // whitelist: true → descarta propiedades no declaradas en el DTO
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger: genera documentación interactiva en /api/docs
  const config = new DocumentBuilder()
    .setTitle('TFG API')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'authorization')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(3000);
}
```

---

## 6. Arquitectura limpia en el backend

### El problema de la arquitectura "plana"

Sin estructura explícita, todo acaba en el controlador:
```typescript
// El antipatrón "fat controller"
@Post('login')
async login(@Body() dto: LoginDto) {
  const user = await this.prisma.user.findUnique(...); // lógica de DB en el controller
  const hash = bcrypt.compare(...);                    // lógica de negocio en el controller
  const token = jwt.sign(...);                         // lógica de auth en el controller
  return { token };
}
```

Esto hace el código imposible de testear y reutilizar.

### La solución: 4 capas por feature

```
modules/auth/
├── api/                   ← CAPA HTTP
│   ├── auth.controller.ts     (recibe HTTP, valida DTO, delega al servicio)
│   ├── dto/                   (contratos de entrada/salida)
│   └── guards/                (protección de endpoints)
├── application/           ← CAPA DE APLICACIÓN
│   ├── auth.service.ts        (orquesta casos de uso)
│   └── use-cases/             (una operación = una clase)
│       ├── login-user.use-case.ts
│       └── refresh-token.use-case.ts
├── domain/                ← CAPA DE DOMINIO
│   └── entities/              (tipos de negocio, sin frameworks)
│       └── user.entity.ts
└── infrastructure/        ← CAPA DE INFRAESTRUCTURA
    └── passport/              (implementación concreta: JWT Strategy)
```

### Flujo de una petición POST /auth/login

```
HTTP Request
    │
    ▼
AuthController.login(@Body() dto: LoginUserDto)
    │  ← Valida DTO automáticamente (class-validator)
    │
    ▼
AuthService.login(dto)
    │  ← Solo delega, no tiene lógica
    │
    ▼
LoginUserUseCase.execute({ username, password })
    │  ← TODA la lógica está aquí
    │  1. Busca usuario por username
    │  2. Compara hash de contraseña (bcrypt)
    │  3. Lanza UnauthorizedException si falla
    │  4. Genera accessToken (JWT corto)
    │  5. Genera refreshToken (JWT largo)
    │
    ▼
UsersRepository.findByUsername(username)
    │  ← Abstracción de la DB
    │
    ▼
PrismaService.user.findUnique(...)
    │  ← Operación real de DB
    │
    ▼
PostgreSQL query
```

### Por qué un UseCase por operación

Cada caso de uso implementa **exactamente una** operación de negocio:

```typescript
@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository, // abstracción
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginResponse> {
    const user = await this.usersRepository.findByUsername(input.username.trim());

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
      // Mismo mensaje para usuario no encontrado y contraseña incorrecta
      // → no revela si el username existe (seguridad)
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Access token: vida corta (1d), contiene sub + username
    const token = await this.jwtService.signAsync({ sub: user.id, username: user.username });

    // Refresh token: vida larga (7d), firmado con secret diferente, campo type para distinguirlo
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, username: user.username, type: 'refresh' },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      },
    );

    return { token, refreshToken };
  }
}
```

**Ventajas medibles:**
- Testeable en aislamiento: inyectas mocks del repositorio y el JWT service.
- Reutilizable: el controlador puede llamar al mismo use case desde distintos endpoints.
- Legible: el nombre describe exactamente qué hace.

### El patrón Repository

```typescript
// Contrato (en domain o application)
abstract class UsersRepository {
  abstract findByUsername(username: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract create(data: CreateUserData): Promise<UserEntity>;
}

// Implementación concreta (en infrastructure)
@Injectable()
class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { username } });
    return row ? UserMapper.toDomain(row) : null;
  }
  // ...
}
```

**¿Por qué esta abstracción?** Los use cases hablan con `UsersRepository` (abstracto), no con Prisma directamente. Si mañana cambias de Prisma a TypeORM, solo cambias la implementación, no el use case ni los tests.

En `users.module.ts`:
```typescript
{
  provide: UsersRepository,     // cuando alguien pida UsersRepository...
  useClass: PrismaUsersRepository, // ...dame una instancia de PrismaUsersRepository
}
```

---

## 7. Autenticación JWT con Passport

### ¿Por qué JWT?

- **Sin estado (stateless)**: el servidor no guarda sesiones. El token viaja en cada request.
- **Verificable**: cualquier servidor con el mismo secret puede validar el token.
- **Autocontenido**: el payload incluye el userId sin ir a la DB.

### Anatomía de un JWT

Un JWT tiene 3 partes separadas por `.`:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← Header (algoritmo + tipo)
.eyJzdWIiOiJjbW50N3VhY3owMDAwdm9kY2gwZ29wOXVqIiwidXNlcm5hbWUiOiJ0ZXN0X3VzZXIifQ  ← Payload
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (HMAC-SHA256 con el secret)
```

El **payload** decodificado (base64) del access token en este proyecto:
```json
{
  "sub": "cmnt7uacz0000vodch0gop9uj",
  "username": "test_user",
  "iat": 1718000000,
  "exp": 1718086400
}
```

### Dos tokens, dos propósitos

| | Access Token | Refresh Token |
|--|--|--|
| **Vida** | 1 día | 7 días |
| **Secret** | `JWT_SECRET` | `JWT_REFRESH_SECRET` |
| **Uso** | Autenticar cada request | Obtener un nuevo access token |
| **Campo extra** | — | `type: 'refresh'` |
| **Cuándo expira** | El usuario debe hacer refresh | El usuario debe volver a hacer login |

**¿Por qué secretos diferentes?** Si usas el mismo secret y alguien roba el refresh token, puede usarlo como access token directamente. Con secretos separados, solo funciona en el endpoint `/auth/refresh`.

### Passport y la JwtStrategy

Passport es un middleware de autenticación para Node.js. El flujo:

```
GET /tasks/me
Authorization: Bearer eyJ...
         │
         ▼
JwtAuthGuard (@UseGuards(JwtAuthGuard))
         │
         ▼
PassportModule verifica el token con JwtStrategy
         │
         ├─ Token válido → llama a strategy.validate(payload)
         │                → devuelve { sub, username }
         │                → lo adjunta a req.user
         │
         └─ Token inválido → 401 Unauthorized
```

```typescript
// backend/src/modules/auth/infrastructure/passport/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extrae de "Authorization: Bearer ..."
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // Si el token es válido, este método recibe el payload ya decodificado
  // Lo que retorne aquí se convierte en req.user
  validate(payload: JwtPayload): JwtPayload {
    return payload; // { sub: userId, username }
  }
}
```

El guard es mínimo:
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// AuthGuard('jwt') busca la estrategia registrada con nombre 'jwt' (= JwtStrategy)
```

Uso en el controlador:
```typescript
@UseGuards(JwtAuthGuard)
@Get('me')
me(@Req() req: AuthenticatedRequest): AuthMeResponseDto {
  return { id: req.user.sub, username: req.user.username };
  // req.user viene de JwtStrategy.validate()
}
```

### Flujo completo de autenticación

```
┌─────────┐                    ┌──────────┐              ┌────────┐
│ Cliente │                    │ Backend  │              │   DB   │
└────┬────┘                    └────┬─────┘              └───┬────┘
     │                              │                        │
     │  POST /auth/login            │                        │
     │  { username, password }      │                        │
     │─────────────────────────────►│                        │
     │                              │ findByUsername()       │
     │                              │───────────────────────►│
     │                              │      User row          │
     │                              │◄───────────────────────│
     │                              │ bcrypt.compare()       │
     │                              │ jwtService.signAsync() │
     │  { token, refreshToken }     │                        │
     │◄─────────────────────────────│                        │
     │                              │                        │
     │  GET /tasks/me               │                        │
     │  Authorization: Bearer token │                        │
     │─────────────────────────────►│                        │
     │                              │ JwtStrategy.validate() │
     │                              │ (sin ir a DB)          │
     │  [{ id, title, ... }, ...]   │                        │
     │◄─────────────────────────────│                        │
```

---

## 8. DTOs, validación y Swagger

### ¿Qué es un DTO?

Data Transfer Object — una clase que define la forma exacta de los datos que entran o salen de un endpoint.

```typescript
// backend/src/modules/auth/api/dto/register-user.dto.ts
export class RegisterUserDto {
  @ApiProperty({ example: 'user@example.com' })  // documenta en Swagger
  @Transform(({ value }) => value.trim().toLowerCase()) // limpia antes de validar
  @IsEmail()                                      // valida formato email
  @MaxLength(254)                                 // RFC 5321 límite de email
  email!: string;

  @ApiProperty({ example: 'test_user' })
  @Transform(({ value }) => value.trim())
  @IsString()
  @Matches(/^[a-zA-Z0-9._-]+$/)  // solo caracteres seguros para username
  @MinLength(3)
  @MaxLength(20)
  username!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)  // bcrypt ignora más de 72 caracteres
  password!: string;
}
```

**¿Por qué decoradores y no validación manual?** Los decoradores de `class-validator` son declarativos, reutilizables y se integran con el `ValidationPipe` global de NestJS. La validación ocurre automáticamente antes de que llegue al controlador.

### Swagger automático

Con `@ApiProperty()` en los DTOs y `@ApiOperation()`, `@ApiOkResponse()` en los controladores, NestJS genera automáticamente la documentación en `/api/docs`.

```typescript
@Post('login')
@ApiOperation({ summary: 'Log in with username and password' })
@ApiOkResponse({ type: LoginResponseDto })         // tipo de respuesta → aparece en Swagger
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
async login(@Body() dto: LoginUserDto) {
  return this.authService.login(dto);
}
```

Resultado: una interfaz interactiva donde puedes probar todos los endpoints sin necesidad de Postman.

### Separación DTO / Input / Entity

| Tipo | Dónde vive | Propósito |
|------|-----------|-----------|
| `LoginUserDto` | `api/dto/` | Contrato HTTP (validación, Swagger) |
| `LoginUserInput` | `application/inputs/` | Parámetros del use case (sin decoradores HTTP) |
| `UserEntity` | `domain/entities/` | Representación de negocio (sin Prisma, sin HTTP) |
| `LoginResponseDto` | `api/dto/` | Contrato de respuesta HTTP |
| `LoginResponse` | `application/types/` | Tipo de retorno del use case |

Esta separación permite que los use cases no dependan ni de HTTP ni de Prisma.

---

## 9. Integración de IA (Google Gemini)

### El caso de uso BreakdownTask

El endpoint `POST /tasks/breakdown` recibe un título de tarea y devuelve subtareas sugeridas por IA.

```typescript
// Simplificado del use case
@Injectable()
export class BreakdownTaskUseCase {
  private model: GenerativeModel;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async execute(title: string): Promise<BreakdownResult> {
    const prompt = `Descompón la siguiente tarea en 3-6 subtareas concretas y accionables: "${title}"
    Responde SOLO con un JSON: { "subtasks": ["subtarea1", "subtarea2", ...] }`;

    const result = await this.model.generateContent(prompt);
    const json = JSON.parse(result.response.text());
    return { title, subtasks: json.subtasks };
  }
}
```

**Por qué esto es valioso para la defensa:** ilustra cómo integrar una API externa (IA) dentro de la arquitectura limpia — el use case encapsula la lógica, el controlador no sabe que hay IA por detrás.

---

## 10. CI/CD con GitHub Actions

### ¿Qué es CI/CD?

- **CI (Continuous Integration)**: cada push/PR ejecuta automáticamente validaciones (lint, build, tests).
- **CD (Continuous Deployment)**: automatización del despliegue (no implementado en este proyecto, pero la base está).

### Los tres workflows

#### 1. Backend Lint + Build (en cada push a main/dev)

```yaml
# .github/workflows/back-fail-check.yml
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend   # todos los comandos corren desde backend/
    steps:
      - uses: actions/checkout@v4.2.0
      - uses: actions/setup-node@v4.1.0
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - run: npm ci           # ci = install determinístico desde package-lock.json
      - run: npm run lint      # ESLint
      - run: npm run build     # tsc + nest build
```

`npm ci` en lugar de `npm install`: usa exactamente las versiones del lock file, no resuelve semver.

#### 2. Frontend Type-check + Lint

```yaml
# .github/workflows/front-fail-check.yml
# Mismo patrón pero en working-directory: frontend
steps:
  - run: npm ci
  - run: npm run lint       # ESLint
  - run: npm run typecheck  # tsc --noEmit (solo verifica tipos, no compila)
```

#### 3. E2E Tests con base de datos real

```yaml
# .github/workflows/backend-e2e-tests.yml
on:
  pull_request:
    branches: [main, dev]
    paths:
      - "backend/**"    # solo se ejecuta si cambia algo en backend/

services:
  postgres:              # GitHub Actions levanta un contenedor PostgreSQL
    image: postgres:16
    env:
      POSTGRES_USER: toolboard
      POSTGRES_PASSWORD: toolboard
      POSTGRES_DB: toolboard
    options: >-
      --health-cmd "pg_isready -U toolboard -d toolboard"
      --health-interval 10s
      --health-retries 5

env:
  DATABASE_URL: postgresql://toolboard:toolboard@localhost:5432/toolboard?schema=public

steps:
  - run: npm ci
  - run: npx prisma generate       # genera el cliente Prisma
  - run: npx prisma migrate deploy # aplica migraciones a la DB temporal
  - run: npm run test:e2e -- --runInBand  # runInBand = tests secuenciales (no paralelos)
```

**Diferencia crítica:** Los E2E tests usan una base de datos PostgreSQL real, no mocks. Esto garantiza que las migraciones son correctas y las queries funcionan en una DB de verdad.

### Estrategia de ramas

```
main  ← producción / código estable
  └── dev  ← integración / desarrollo activo
       └── feature/xxx  ← features individuales
```

Los workflows se ejecutan en PRs hacia `main` y `dev`, bloqueando el merge si fallan.

---

## 11. Frontend: React Native y Expo

### React Native vs React

React renderiza en el DOM del navegador. React Native renderiza en **componentes nativos del sistema operativo**:

| React (web) | React Native (móvil) |
|-------------|---------------------|
| `<div>` | `<View>` |
| `<p>`, `<span>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |
| CSS classes | StyleSheet.create() |

El código de lógica (hooks, estado, servicios) es idéntico. Solo los componentes de UI cambian.

### ¿Por qué Expo?

Expo es una capa sobre React Native que:
- Proporciona herramientas de build sin necesidad de Xcode/Android Studio.
- Incluye SDK de APIs nativas (cámara, notificaciones, etc.) pre-configuradas.
- Permite correr en web además de móvil.
- `expo-router` añade enrutamiento file-based.

Sin Expo, configurar un proyecto React Native desde cero (React Native CLI) requiere instalar y configurar SDKs nativos completos de Android e iOS.

### Estructura de `frontend/package.json` — dependencias clave

```json
{
  "dependencies": {
    "expo": "~54.0.0",                    // SDK base
    "expo-router": "~6.0.23",            // enrutamiento por sistema de archivos
    "react": "19.1.0",
    "react-native": "0.81.5",
    "@tanstack/react-query": "^5.100.8", // estado del servidor
    "zustand": "^5.0.12",                // estado global del cliente
    "react-hook-form": "^7.75.0",        // formularios
    "zod": "^4.4.2",                     // validación de esquemas
    "react-native-chart-kit": "^6.12.2"  // gráficas de estadísticas
  }
}
```

---

## 12. Enrutamiento: Expo Router

### File-based routing

Expo Router usa el sistema de archivos como definición de rutas. No hay un archivo de rutas central — cada archivo en `app/` es una ruta.

```
frontend/app/
├── _layout.tsx          → layout raíz (aplica a todas las rutas)
├── index.tsx            → /  (splash/home)
├── auth/
│   ├── login.tsx        → /auth/login
│   └── register.tsx     → /auth/register
├── home/
│   └── index.tsx        → /home
├── tasks/
│   ├── index.tsx        → /tasks
│   └── [id].tsx         → /tasks/:id  (ruta dinámica)
├── focus/
│   └── index.tsx        → /focus
└── stats/
    └── index.tsx        → /stats
```

**Comparación con React Navigation (alternativa popular):**

```typescript
// React Navigation — configuración manual de rutas
const Stack = createNativeStackNavigator();
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Tasks" component={TasksScreen} />
</Stack.Navigator>

// Expo Router — cero configuración
// Solo crea el archivo app/tasks/index.tsx y la ruta /tasks existe automáticamente
```

### El layout raíz — `app/_layout.tsx`

```typescript
const queryClient = new QueryClient();

// Rutas que no necesitan autenticación
const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register'];

// Guard de autenticación como componente React
function AuthGuard() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const pathname = usePathname();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return; // espera a que navegación esté lista
    if (!accessToken && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace('/'); // redirige a splash si no autenticado
    }
  }, [accessToken, pathname, navigationState?.key]);

  return null; // no renderiza nada, solo efecto secundario
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>  {/* TanStack Query disponible en toda la app */}
      <ThemedStack />     {/* navegación con tema dinámico */}
      <AuthGuard />       {/* protección de rutas */}
      <StreakCelebrationOverlay />  {/* modal global de rachas */}
      <MotivationalPhraseModal />  {/* modal global de frases */}
    </QueryClientProvider>
  );
}
```

**Puntos clave:**
- `QueryClientProvider` al nivel más alto → todos los hooks `useQuery` y `useMutation` tienen acceso al mismo cache.
- `AuthGuard` es un componente de solo-efecto (renderiza `null`) que observa el token y redirige.
- Los modales globales (`StreakCelebrationOverlay`, `MotivationalPhraseModal`) viven aquí porque deben poder mostrarse desde cualquier parte de la app.

---

## 13. Estado del servidor: TanStack React Query

### El problema que resuelve

Sin React Query, cada componente gestiona su propio estado de fetching:
```typescript
// Sin React Query — problemático
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then(setTasks)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  // Problemas: no hay caché, si montas el componente 3 veces = 3 requests,
  // no hay invalidación automática, no hay refetch en focus
}
```

Con React Query:
```typescript
// Con React Query
function TaskList() {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: 1000 * 60 * 5, // considera los datos frescos por 5 minutos
  });
  // Cache automático, deduplicación de requests, refetch en focus,
  // background refetch, loading/error states incluidos
}
```

### El ciclo de vida de un query

```
Componente monta
    │
    ▼
useQuery({ queryKey: ['tasks'], queryFn: getTasks })
    │
    ├─ ¿Hay datos en caché? → muestra datos inmediatamente (stale-while-revalidate)
    │                       → hace refetch en background
    │
    └─ No hay caché → isLoading: true → llama queryFn → actualiza caché → isLoading: false
```

### Mutations e invalidación

```typescript
const createTaskMutation = useMutation({
  mutationFn: (title: string) => createTask(title),
  onSuccess: () => {
    // Invalida el caché de ['tasks'] → fuerza refetch automático
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});

// Uso:
createTaskMutation.mutate('Nueva tarea');
```

**Flujo de datos con React Query:**
```
Usuario crea tarea
    │
    ▼
useMutation.mutate()
    │
    ▼
POST /tasks → backend → DB
    │
    ▼
onSuccess: invalidateQueries(['tasks'])
    │
    ▼
React Query hace GET /tasks automáticamente
    │
    ▼
UI se actualiza con la lista nueva
```

---

## 14. Estado global del cliente: Zustand

### ¿Cuándo usar Zustand vs React Query?

| | React Query | Zustand |
|--|--|--|
| **Para** | Estado del servidor (datos de la API) | Estado del cliente (UI, sesión, preferencias) |
| **Origen** | Fetch a backend | Lógica local |
| **Ejemplo** | Lista de tareas | Token JWT, tema activo, modal abierto |

### La auth store

```typescript
// frontend/src/store/auth.store.ts
type AuthState = {
  accessToken: string;
  refreshToken: string;
  currentUser: CurrentUserResponse | null;
  setSession: (input: { accessToken: string; refreshToken: string; currentUser: CurrentUserResponse }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: '',
  refreshToken: '',
  currentUser: null,
  setSession: ({ accessToken, refreshToken, currentUser }) =>
    set({ accessToken, refreshToken, currentUser }),
  clearSession: () =>
    set({ accessToken: '', refreshToken: '', currentUser: null }),
}));
```

Uso desde cualquier componente:
```typescript
// Suscripción selectiva — solo re-renderiza si accessToken cambia
const accessToken = useAuthStore((state) => state.accessToken);

// Acceso a la acción
const setSession = useAuthStore((state) => state.setSession);
```

### Otras stores

| Store | Responsabilidad |
|-------|----------------|
| `auth.store` | Token JWT, usuario actual |
| `theme.store` | Paleta de colores activa, color de icono |
| `focus-session.store` | Sesión de foco activa (temporizador) |
| `streak-celebration.store` | Disparar animación de racha |
| `phrase-modal.store` | Mostrar frases motivacionales |

---

## 15. Cliente HTTP: el patrón api.client.ts

### Un único punto de entrada para todas las peticiones

```typescript
// frontend/src/services/api.client.ts

// Detección inteligente de la URL base
function inferBaseUrl() {
  // 1. Variable de entorno explícita
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return normalizeBaseUrl(envUrl);

  // 2. IP dinámica de Expo (para dispositivos físicos en la misma red)
  const hostUri = getExpoHostUri();
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000`;
  }

  // 3. Emulador Android usa esta IP para acceder al host
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';

  // 4. Fallback
  return 'http://localhost:3000';
}
```

**Por qué es necesaria esta detección:** Un emulador Android no puede usar `localhost` — para él, `localhost` es el propio emulador. La IP `10.0.2.2` es el alias estándar del host en el emulador de Android.

```typescript
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  // Lee el token del store de Zustand en cada request (siempre el más fresco)
  const { useAuthStore } = await import('../store/auth.store');
  const token = useAuthStore.getState().accessToken;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // añade token si existe
    ...((init?.headers as Record<string, string>) ?? {}),    // headers del caller tienen prioridad
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    // Extrae el mensaje de error del backend (NestJS usa { message: '...' })
    const message = data?.message ?? data?.error ?? 'Request failed';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return data as T;
}
```

Uso desde los servicios:
```typescript
// frontend/src/services/tasks.service.ts
export function getTasks(): Promise<Task[]> {
  return apiRequest<Task[]>('/tasks/me');
}

export function createTask(title: string): Promise<Task> {
  return apiRequest<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}
```

**Por qué no usar axios:** `fetch` es nativo en React Native y en navegadores modernos. Evitar dependencias innecesarias reduce el bundle size y la complejidad.

---

## 16. Sistema de temas y design tokens

### Design tokens

Los design tokens son variables que centralizan las decisiones de diseño: colores, espaciados, radios, tipografía.

```typescript
// frontend/src/shared/theme/colors.ts — tokens base
export const colors = {
  primary:    '#007AFF',
  background: '#0b1020',
  surface:    '#1a2940',
  text:       '#FFFFFF',
  error:      '#FF3B30',
  success:    '#34C759',
} as const;  // 'as const' → tipos literales en TypeScript

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24,
} as const;

export const radii = {
  sm: 8, md: 14, lg: 16, pill: 999,
} as const;
```

### El sistema de paletas dinámicas

El proyecto tiene **20 paletas de colores** intercambiables:

```typescript
// Cada paleta implementa el mismo contrato
type ColorPalette = {
  primary: string;
  background: string;
  surface: string;
  text: string;
  // ... 14 campos más
};

// Factory function para crear paletas con defaults sensatos
function createPalette(opts: Partial<ColorPalette> & { primary: string; background: string; ... }): ColorPalette {
  return {
    primary: opts.primary,
    text: opts.text ?? '#FFFFFF',  // default si no se especifica
    // ...
  };
}

// Ejemplo de paleta
export const arcticPalette = createPalette({
  primary:    '#00C2CB',
  background: '#080c0e',
  surface:    '#121c20',
  border:     '#1c282e',
  text:       '#EEFBFF',
});
```

### El hook `useTheme`

Componentes acceden al tema activo a través de un hook:

```typescript
// Dentro de un componente
function MyButton() {
  const colors = useTheme(); // lee del theme.store

  return (
    <Pressable style={{ backgroundColor: colors.primary }}>
      <Text style={{ color: colors.text }}>Click</Text>
    </Pressable>
  );
}
```

### Estilos colocalizados

Cada componente tiene su archivo de estilos junto a él:

```
AppButton.tsx           ← componente
AppButton.styles.ts     ← estilos
```

```typescript
// AppButton.styles.ts — función que recibe colores y devuelve estilos
export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    base: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: radii.md,
    },
    pressed: { opacity: 0.75 },
    disabled: { opacity: 0.4 },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
    },
  });

// En AppButton.tsx
const colors = useTheme();
const styles = makeStyles(colors); // estilos se recalculan al cambiar el tema
```

**¿Por qué `StyleSheet.create` y no objetos literales?** React Native optimiza los estilos creados con `StyleSheet.create` (los serializa y registra con un ID numérico). También añade validación de tipos.

---

## 17. Estructura por features en el frontend

### El problema de organizar por tipo

```
❌ Organización por tipo (no escalable)
src/
├── components/    ← todos los componentes mezclados
├── hooks/         ← todos los hooks mezclados
├── services/      ← todos los servicios mezclados
└── types/         ← todos los tipos mezclados
```

### La solución: feature folders

```
✅ Organización por feature (escalable)
src/
├── features/
│   ├── auth/          ← todo lo relacionado con autenticación
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── FormHeader.tsx
│   │   │   └── FormModeSwitcher.tsx
│   │   └── hooks/
│   │       ├── useLoginForm.ts     ← lógica del formulario de login
│   │       └── useLoginTester.ts
│   │
│   ├── tasks/         ← todo lo relacionado con tareas
│   │   ├── components/
│   │   └── hooks/
│   │       ├── useTasks.ts         ← useQuery para tareas
│   │       └── useCreateTask.ts    ← useMutation para crear
│   │
│   └── focus/         ← todo lo relacionado con sesiones de foco
│       ├── components/
│       └── hooks/
│
├── shared/            ← componentes y utilities reutilizables en cualquier feature
│   ├── components/    ← AppButton, AppField, AppCard, BottomNav, etc.
│   ├── hooks/         ← useAuth (hook compartido)
│   └── theme/         ← colores, espaciados, paletas
│
├── services/          ← comunicación con el backend (1 archivo por recurso)
│   ├── api.client.ts
│   ├── auth.service.ts
│   ├── tasks.service.ts
│   └── focus.service.ts
│
└── store/             ← estado global (1 store por dominio)
    ├── auth.store.ts
    └── theme.store.ts
```

### El patrón hook de feature

Cada feature encapsula su lógica en hooks, manteniendo los componentes como pura UI:

```typescript
// features/auth/hooks/useLoginForm.ts
export function useLoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  // ... estado del formulario

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === 'register') {
        await register({ email, username, password });
        setMessage({ text: 'Registrado. Ahora puedes entrar.', type: 'success' });
        setMode('login');
        return;
      }
      const result = await login({ username, password });
      const currentUser = await getCurrentUser(result.token);
      setSession({ accessToken: result.token, refreshToken: result.refreshToken, currentUser });
      router.replace('/home');
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return { mode, setMode, email, setEmail, /* ... */, handleSubmit };
}

// features/auth/components/LoginForm.tsx — solo UI
export function LoginForm() {
  const { mode, setMode, email, setEmail, /* ... */, handleSubmit } = useLoginForm();
  // componente completamente declarativo, sin lógica
  return (
    <FormShell>
      <FormHeader mode={mode} />
      <AppField label="Email" value={email} onChangeText={setEmail} />
      <AppButton label="Entrar" onPress={handleSubmit} />
    </FormShell>
  );
}
```

---

## 18. Flujo completo de datos extremo a extremo

### Ejemplo: El usuario crea una tarea

```
1. USUARIO escribe "Estudiar para el examen" y pulsa "Crear"
         │
         ▼
2. COMPONENTE CreateTaskForm
   → llama hook useCreateTask().mutate("Estudiar para el examen")
         │
         ▼
3. TANSTACK QUERY useMutation
   → llama mutationFn: (title) => createTask(title)
         │
         ▼
4. SERVICIO tasks.service.ts
   → createTask(title) llama apiRequest('/tasks', { method: 'POST', body: ... })
         │
         ▼
5. API CLIENT api.client.ts
   → Lee token de useAuthStore.getState().accessToken
   → Construye headers con Authorization: Bearer <token>
   → fetch('http://localhost:3000/tasks', { method: 'POST', headers, body })
         │
         ▼
6. NESTJS TaskController.createTask()
   → @UseGuards(JwtAuthGuard) verifica el token con JwtStrategy
   → @Body() dto: CreateTaskDto — ValidationPipe valida el body
   → llama tasksService.createTask(req.user.sub, dto)
         │
         ▼
7. NESTJS TasksService.createTask()
   → llama createTaskUseCase.execute({ userId, title })
         │
         ▼
8. CASO DE USO CreateTaskUseCase.execute()
   → prisma.task.create({ data: { title, userId } })
         │
         ▼
9. PRISMA ORM
   → genera SQL: INSERT INTO tasks (id, title, user_id, ...) VALUES (...)
         │
         ▼
10. POSTGRESQL
    → ejecuta el INSERT
    → devuelve la fila creada
         │
         ▼
11. RESPUESTA sube por el mismo camino
    → Prisma → UseCase → Service → Controller → HTTP 201 Created { id, title, ... }
         │
         ▼
12. API CLIENT
    → response.ok → JSON.parse → devuelve Task tipado
         │
         ▼
13. TANSTACK QUERY onSuccess
    → queryClient.invalidateQueries(['tasks'])
    → dispara refetch automático de GET /tasks/me
         │
         ▼
14. UI se actualiza con la lista de tareas incluyendo la nueva
```

---

## 19. Preguntas frecuentes de defensa

### ¿Por qué NestJS en lugar de Express?

Express es un micro-framework sin convenciones: tú decides cómo estructurar el código. NestJS proporciona un sistema de módulos, inyección de dependencias, decoradores, y patrones establecidos. Para un proyecto académico que quiere demostrar arquitectura limpia, NestJS encaja mejor porque la estructura es explícita y testeable.

### ¿Por qué Prisma en lugar de TypeORM o Sequelize?

- **Prisma** tiene un schema declarativo (.prisma) como única fuente de verdad. Los tipos TypeScript se generan automáticamente. Las queries son type-safe.
- **TypeORM** usa decoradores en las entidades — mezcla el dominio con la infraestructura de ORM.
- **Sequelize** es JavaScript-first; el soporte TypeScript es añadido.

Prisma fue la elección más moderna y con mejor DX (Developer Experience) para 2024.

### ¿Por qué dos tokens JWT en lugar de uno?

El access token tiene vida corta (1 día) por seguridad — si se roba, expira pronto. Pero no queremos que el usuario haga login cada día. El refresh token (7 días, secret diferente) permite obtener un nuevo access token sin credenciales. Si el refresh token también se roba, el usuario hace login explícito.

### ¿Por qué TanStack Query Y Zustand? ¿No es redundante?

No — tienen responsabilidades diferentes:
- **TanStack Query** gestiona datos del servidor: fetching, caching, invalidación, background sync.
- **Zustand** gestiona estado del cliente: el token JWT, el tema activo, si un modal está abierto.

El token JWT no viene de un `useQuery` — viene de un login activo y persiste en memoria. Zustand es la herramienta adecuada para eso.

### ¿Qué ventaja tiene la arquitectura por features frente a por tipos?

La arquitectura por tipos (components/, hooks/, services/ a nivel global) escala mal: cuando el proyecto crece, un bug en "tasks" requiere saltar entre 4 carpetas. La arquitectura por features (features/tasks/) agrupa todo lo que pertenece a una funcionalidad. Cuando eliminas una feature, borras una carpeta. Cuando añades una, no tocas las demás.

### ¿Por qué CUID en lugar de UUID o autoincrement?

- **Autoincrement** revela el volumen de datos (el usuario 47 sabe que hay 46 usuarios antes que él) y es difícil de distribuir.
- **UUID (v4)** es aleatorio pero no sorteable por tiempo.
- **CUID** es único, sorteable por tiempo de creación, y no revela información sobre el volumen de datos. Ideal para IDs públicos en APIs.

### ¿Qué es la validación whitelist en ValidationPipe?

`whitelist: true` significa que el ValidationPipe descarta automáticamente cualquier propiedad no declarada en el DTO. Si el cliente envía `{ username: "adam", isAdmin: true }` y el DTO solo declara `username`, el `isAdmin` se descarta antes de llegar al controlador. Esto es una medida de seguridad básica contra mass assignment.

### ¿Por qué los E2E tests usan una DB real en lugar de mocks?

Mockear la DB a nivel de E2E significa que no estás testando las migraciones, las restricciones SQL (unicidad, claves foráneas), ni la forma real de las respuestas. Si hay un bug en la migración, los tests con mock pasan pero la aplicación falla en producción. La DB real en CI cierra ese gap.

---

## Proyecto de práctica recomendado

Para consolidar todos estos conceptos, construye un **gestor de notas** con el mismo stack:

### Backend (NestJS + Prisma + PostgreSQL)

**Schema mínimo:**
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  username     String   @unique
  passwordHash String
  notes        Note[]
  createdAt    DateTime @default(now())
}

model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Módulos a implementar en orden:**
1. `PrismaModule` + `PrismaService` (infraestructura)
2. `UsersModule` con `RegisterUserUseCase`
3. `AuthModule` con `LoginUserUseCase`, `JwtStrategy`, `JwtAuthGuard`
4. `NotesModule` con CRUD completo (List, Create, Update, Delete, GetById)

### Frontend (React Native + Expo)

**Pantallas en orden:**
1. Splash/Auth (`app/index.tsx`)
2. Login/Register (`app/auth/login.tsx`)
3. Lista de notas (`app/notes/index.tsx`) — con `useQuery`
4. Crear nota — con `useMutation` + `invalidateQueries`
5. Detalle/editar nota (`app/notes/[id].tsx`)

**Stores de Zustand:**
- `auth.store.ts` — igual que en el TFG

**Servicios:**
- `api.client.ts` — igual que en el TFG
- `auth.service.ts` — igual que en el TFG
- `notes.service.ts` — CRUD a `/notes`

### Checklist de conceptos demostrados

- [ ] Monorepo con npm workspaces
- [ ] Docker Compose para PostgreSQL
- [ ] Schema Prisma con relaciones y migraciones
- [ ] NestJS con módulos, DI, decoradores
- [ ] Arquitectura limpia: Controller → Service → UseCase → Repository
- [ ] JWT con access + refresh token
- [ ] Passport JwtStrategy + JwtAuthGuard
- [ ] DTOs con class-validator + Swagger
- [ ] Expo Router con rutas protegidas
- [ ] TanStack Query para fetching y cache
- [ ] Zustand para estado de sesión
- [ ] api.client.ts centralizado
- [ ] Separación shared/features
- [ ] GitHub Actions con lint, build y E2E tests

---

*Generado el 2026-06-13 a partir del análisis completo del código fuente del TFG.*
