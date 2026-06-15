# Documentación de la Aplicación: ValidaClientes

> **Versión:** 0.0.1  
> **Fecha:** Junio 2026  
> **Propósito:** Documentación técnica integral del sistema de validación de clientes conectado a IBM i (AS/400)

---

## Índice

1. [Descripción General](#1-descripción-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Estructura del Proyecto](#4-estructura-del-proyecto)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [Flujo de Autenticación](#6-flujo-de-autenticación)
7. [Flujo de Validación de Clientes](#7-flujo-de-validación-de-clientes)
8. [API Endpoints](#8-api-endpoints)
9. [Configuración y Despliegue](#9-configuración-y-despliegue)
10. [Pruebas](#10-pruebas)
11. [Vulnerabilidades Detectadas y Plan de Mejora](#11-vulnerabilidades-detectadas-y-plan-de-mejora)
12. [Recomendaciones Técnicas](#12-recomendaciones-técnicas)

---

## 1. Descripción General

**ValidaClientes** es una aplicación web tipo dashboard/SaaS que permite:

- Autenticación de usuarios (registro e inicio de sesión)
- Validación de datos de clientes contra un sistema IBM i (AS/400) mediante un stored procedure (`SP_VALIDTC`)
- Visualización de dashboard con estadísticas y actividad reciente desde la tabla `TABCLI03`

Está diseñada como un template React + TypeScript con una arquitectura modular por features y un backend puente (Express) que conecta con IBM i vía Mapepire.

---

## 2. Arquitectura del Sistema

```
┌──────────────────────┐        ┌─────────────────────────┐       ┌────────────────┐
│   React SPA (Vite)   │ ────→ │   API Server (Express)   │ ───→ │  IBM i (AS/400)│
│   Frontend :5173     │  HTTP │   :3001                  │ Mapepire │  Stored Proc.│
│                      │       │   helmet, cors, ratelimit│       │  TABCLI03      │
└──────────────────────┘       └─────────────────────────┘       └────────────────┘
```

### Frontend (React SPA)

- Cliente React renderizado con Vite
- Estado global con Zustand (auth, theme, UI)
- Protección de rutas mediante `ProtectedRoute`
- Comunicación con API mediante Axios con interceptor de token

### Backend (API Server)

- Express.js con Mapepire para conexión a IBM i
- Validación de datos con Zod
- Rate limiting y seguridad básica (helmet, cors)
- Usuarios en memoria (sin persistencia en disco)

---

## 3. Stack Tecnológico

### Frontend

| Tecnología       | Versión | Propósito            |
| ---------------- | ------- | -------------------- |
| React            | 19.2.0  | UI Framework         |
| TypeScript       | 5.9.3   | Tipado estático      |
| Vite             | 7.2.4   | Bundler / Dev server |
| TailwindCSS      | 4.1.18  | Estilos utilitarios  |
| Zustand          | 5.0.11  | Estado global        |
| Axios            | 1.13.4  | Cliente HTTP         |
| React Router DOM | 7.13.0  | Enrutamiento         |

### Backend

| Tecnología         | Versión | Propósito              |
| ------------------ | ------- | ---------------------- |
| Express            | 4.19.2  | Servidor HTTP          |
| @ibm/mapepire-js   | 0.6.1   | Conexión a IBM i       |
| Zod                | 3.23.8  | Validación de esquemas |
| Helmet             | 7.1.0   | Seguridad HTTP headers |
| express-rate-limit | 7.4.0   | Rate limiting          |
| Pino               | 9.2.0   | Logging estructurado   |
| dotenv             | 16.4.5  | Variables de entorno   |

---

## 4. Estructura del Proyecto

```
Template-Response/
├── api-server/                    # Backend Express
│   ├── index.js                   # Punto de entrada del servidor
│   └── .env                       # Variables de entorno del servidor
│
├── src/                           # Frontend React
│   ├── app/
│   │   ├── providers.tsx          # Proveedores globales
│   │   ├── routes.ts              # Constantes de rutas
│   │   └── router.tsx             # Configuración del router
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # Layout principal (sidebar + navbar)
│   │   │   ├── Navbar.tsx         # Barra de navegación superior
│   │   │   └── Sidebar.tsx        # Barra lateral de navegación
│   │   ├── ui/
│   │   │   ├── Badge.tsx          # Componente de etiqueta
│   │   │   ├── Card.tsx           # Componente de tarjeta
│   │   │   ├── EmptyState.tsx     # Estado vacío
│   │   │   ├── FormField.tsx      # Campo de formulario
│   │   │   └── ThemeToggle.tsx    # Alternador de tema
│   │   └── ProtectedRoute.tsx     # Guard de autenticación
│   │
│   ├── features/
│   │   ├── auth/                  # Módulo de autenticación
│   │   │   ├── pages/Login.tsx    # Página de login/registro
│   │   │   ├── services.ts        # Lógica de auth (mock/localStorage)
│   │   │   ├── store.ts           # Estado de auth (Zustand + persist)
│   │   │   └── types.ts           # Tipos del módulo auth
│   │   │
│   │   ├── dashboard/             # Módulo de dashboard
│   │   │   ├── pages/Dashboard.tsx # Página de dashboard
│   │   │   ├── services.ts        # Llamadas API del dashboard
│   │   │   └── types.ts           # Tipos del dashboard
│   │   │
│   │   └── validar/               # Módulo de validación
│   │       └── pages/ValidarClientes.tsx  # Formulario de validación
│   │
│   ├── hooks/
│   │   └── useValidarClient.ts    # Hook de validación
│   │
│   ├── services/
│   │   ├── api.ts                 # Cliente Axios (base + interceptors)
│   │   └── clienteService.ts      # Servicio de cliente (legacy)
│   │
│   ├── store/
│   │   ├── themestore.ts          # Estado del tema (claro/oscuro)
│   │   └── uiStore.ts             # Estado de UI (sidebar)
│   │
│   ├── styles/
│   │   └── index.css              # Estilos globales + Tailwind
│   │
│   └── main.tsx                   # Punto de entrada de la app
│
├── shared/
│   └── types.ts                   # Tipos compartidos
│
├── e2e/                           # Tests E2E (Playwright)
├── docs/                          # Documentación
├── .env                           # Variables de entorno del frontend
├── vite.config.ts                 # Configuración de Vite
├── vitest.config.ts               # Configuración de Vitest
└── package.json                   # Dependencias y scripts
```

---

## 5. Modelo de Datos

### 5.1 Cliente (enviado al SP `SP_VALIDTC`)

| Campo     | Tipo   | Longitud Máx | Descripción          |
| --------- | ------ | ------------ | -------------------- |
| `nomCli`  | string | 50           | Nombre del cliente   |
| `patCli`  | string | 50           | Apellido paterno     |
| `matCli`  | string | 50           | Apellido materno     |
| `corrCli` | string | 100          | Correo electrónico   |
| `rucCli`  | string | 11           | RUC / Cédula         |
| `telCli`  | string | 10           | Teléfono             |
| `codVal`  | string | 10           | Código de validación |

### 5.2 Dashboard (desde `CODECRAFT1.TABCLI03`)

| Campo        | Descripción                   |
| ------------ | ----------------------------- |
| `CODCLI`     | Código del cliente            |
| `NOMCLI`     | Nombre                        |
| `PATCLI`     | Apellido paterno              |
| `MATCLI`     | Apellido materno              |
| `STATU_PROD` | Estado (A=Activo, I=Inactivo) |
| `FECMO_PROD` | Fecha de modificación         |
| `FECDI_PROD` | Fecha de ingreso              |

### 5.3 Usuario (en memoria, no persistente)

| Campo      | Tipo   | Descripción                                    |
| ---------- | ------ | ---------------------------------------------- |
| `id`       | string | ID autogenerada                                |
| `name`     | string | Nombre del usuario                             |
| `email`    | string | Correo electrónico                             |
| `password` | string | Contraseña (en texto plano)                    |
| `token`    | string | Token de sesión (formato: `token-{timestamp}`) |

---

## 6. Flujo de Autenticación

### 6.1 Registro

1. Usuario completa formulario (nombre, email, password, confirmar password)
2. Frontend valida: password ≥ 6 caracteres, password === confirmPassword
3. `registerRequest()` guarda usuario en `localStorage` en texto plano
4. Usuario es autenticado automáticamente tras registro
5. Se almacena sesión en `localStorage` via Zustand persist

### 6.2 Inicio de sesión

1. Usuario ingresa email y password
2. `loginRequest()` busca en `localStorage` coincidencia exacta
3. Si encuentra, devuelve usuario con token generado como `token-{timestamp}`
4. Se almacena sesión en `localStorage`
5. Redirecciona a dashboard (`/`)

### 6.3 Protección de rutas

- `ProtectedRoute` verifica existencia de `user` en `useAuthStore`
- Si no hay sesión, redirige a `/login`
- Si hay sesión, renderiza el children protegido

### 6.4 Cierre de sesión

- `logout()` en authStore limpia el usuario de Zustand (y por tanto de localStorage por persist)

> **⚠️ Nota:** En el entorno de pruebas (unitarias), el auth usa localStorage mock.  
> En el API server real, los usuarios están en un array en memoria.

---

## 7. Flujo de Validación de Clientes

1. Usuario completa formulario con datos del cliente en `ValidarClientes.tsx`
2. Validación del lado del cliente: RUC debe tener 11 dígitos, teléfono 10 dígitos
3. El campo `codVal` se envía con valor fijo `"VAL"` (hardcoded)
4. Frontend envía POST a `/api/clientes/validar`
5. Backend valúa datos con Zod (esquema `clienteSchema`)
6. Backend ejecuta stored procedure `SP_VALIDTC` en IBM i
7. Backend devuelve `{ codigoRespuesta: "00" }` (código fijo)
8. Frontend interpreta `"00"` como éxito

---

## 8. API Endpoints

### 8.1 Backend (api-server)

| Método       | Ruta                    | Auth Requerida | Descripción              |
| ------------ | ----------------------- | -------------- | ------------------------ |
| GET          | `/health`               | No             | Health check             |
| POST         | `/api/clientes/validar` | No             | Valida cliente vía SP    |
| GET          | `/api/dashboard`        | No             | Datos del dashboard      |
| POST         | `/api/auth/register`    | No             | Registro de usuario      |
| POST         | `/api/auth/login`       | No             | Inicio de sesión         |
| (cualquiera) | `*`                     | No             | 404 - Ruta no encontrada |

### 8.2 Frontend (servicios mock)

| Función              | Método HTTP | Endpoint                | Propósito         |
| -------------------- | ----------- | ----------------------- | ----------------- |
| `loginRequest()`     | (mock)      | localStorage            | Login simulado    |
| `registerRequest()`  | (mock)      | localStorage            | Registro simulado |
| `validarClient()`    | POST        | `/api/clientes/validar` | Validar cliente   |
| `getDashboardData()` | GET         | `/api/dashboard`        | Obtener dashboard |

> **Nota importante:** `clienteService.ts` hace POST a `ClientFormt/validar` (sin prefijo `/api/`),  
> mientras que el backend espera `/api/clientes/validar`. Esto podría indicar que el archivo está  
> desactualizado o es para otro endpoint.

---

## 9. Configuración y Despliegue

### 9.1 Requisitos

- Node.js ≥ 18
- Mapepire Server (daemon para conexión con IBM i)
- npm

### 9.2 Variables de Entorno

**Frontend (`.env`)**

```
VITE_API_URL=http://localhost:3001
```

**Backend (`api-server/.env`)**

```
DB2_HOST=pub400.com
DB2_USER=usuario
DB2_PASS=password
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=debug
```

### 9.3 Instalación y Ejecución

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd api-server && npm install && cd ..

# Iniciar frontend (puerto 5173)
npm run dev

# Iniciar backend (puerto 3001)
npm run dev:api

# Iniciar ambos concurrentemente
npm run dev:full
```

### 9.4 Build para Producción

```bash
npm run build
# Genera: dist/
```

### 9.5 Pruebas

```bash
# Unitarias (Vitest)
npm test
npm run test:watch
npm run test:coverage

# E2E (Playwright)
npm run test:e2e
npm run test:e2e:ui
```

---

## 10. Pruebas

### Tests Unitarios (Vitest)

| Archivo                                                         | Descripción                       |
| --------------------------------------------------------------- | --------------------------------- |
| `src/store/__tests__/uiStore.test.ts`                           | Tests del store de UI             |
| `src/features/auth/__tests__/store.test.ts`                     | Tests del store de auth           |
| `src/features/validar/pages/__tests__/ValidarClientes.test.tsx` | Tests de formulario de validación |
| `src/features/dashboard/pages/__tests__/Dashboard.test.tsx`     | Tests de dashboard                |

### Tests E2E (Playwright)

| Archivo                 | Descripción            |
| ----------------------- | ---------------------- |
| `e2e/login.spec.ts`     | Flujo de autenticación |
| `e2e/dashboard.spec.ts` | Flujo de dashboard     |

---

## 11. Vulnerabilidades Detectadas y Plan de Mejora

A continuación se listan las vulnerabilidades y problemas de seguridad identificados en la aplicación, clasificados por severidad y con recomendaciones de mitigación.

---

### 🔴 CRÍTICAS

#### V-01: Credenciales de Base de Datos en Texto Plano

**Archivo:** `api-server/.env`

```
DB2_HOST=pub400.com
DB2_USER=codecraft
DB2_PASS=msantos02
```

**Problema:** Las credenciales del IBM i (DB2_USER/DB2_PASS) están en texto plano en el `.env`.

**Riesgo:** Cualquier persona con acceso al servidor o al repositorio puede obtener credenciales de la base de datos IBM i.

**Mitigación:**

- Usar variables de entorno con autenticación por certificado cuando sea posible
- Configurar correctamente el certificado TLS del Mapepire Server (`rejectUnauthorized: true`)
- Rotar las credenciales inmediatamente
- No incluir archivos `.env` en el repositorio (ya están en `.gitignore`)
- Implementar un vault de secretos (HashiCorp Vault, AWS Secrets Manager, etc.)

---

#### V-02: Almacenamiento de Contraseñas en Texto Plano

**Archivos:** `api-server/index.js` (línea 96), `src/features/auth/services.ts`

```js
// Backend - usuarios en memoria
const usuarios = []
// ...
const newUser = { ..., password, token: `token-${Date.now()}` }
usuarios.push(newUser)

// Frontend - usuarios en localStorage
localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
```

**Problema:** Las contraseñas se almacenan **sin hash** tanto en el backend (array en memoria) como en el frontend (localStorage). Cualquier atacante con acceso a localStorage o a la memoria del servidor puede leer las contraseñas.

**Riesgo:** Exposición total de credenciales de usuarios. Si los usuarios reusan contraseñas, otras cuentas quedan comprometidas.

**Mitigación:**

- Usar `bcrypt` o `argon2` para hacer hash de contraseñas antes de almacenarlas
- Nunca almacenar contraseñas en el frontend (localStorage)
- Implementar un mecanismo de autenticación real (JWT con refresh tokens)

---

#### V-03: Ausencia Total de Autenticación en Endpoints del API

**Archivo:** `api-server/index.js` (rutas `/api/clientes/validar` y `/api/dashboard`)

```js
app.post('/api/clientes/validar', async (req, res) => { ... });
app.get('/api/dashboard', async (_req, res) => { ... });
```

**Problema:** Los endpoints de validación de clientes y dashboard **no requieren autenticación**. Cualquier persona que conozca la URL puede acceder a datos sensibles o ejecutar validaciones.

**Riesgo:** Acceso no autorizado a datos de clientes y ejecución del stored procedure sin control.

**Mitigación:**

- Implementar middleware de autenticación JWT en todos los endpoints protegidos
- Validar el token en cada request
- Usar middleware de Express para aplicar autenticación por ruta

```js
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

app.post('/api/clientes/validar', authMiddleware, async (req, res) => { ... });
```

---

#### V-04: Token de Sesión Predecible y Sin Firma

**Archivos:** `api-server/index.js` (línea 238), `src/features/auth/services.ts` (línea 38)

```js
token: `token-${Date.now()}`;
```

**Problema:** El token de autenticación se genera con `Date.now()`, que es trivialmente predecible. No es un JWT firmado, no tiene expiración, y no contiene información del usuario.

**Riesgo:** Un atacante puede generar tokens válidos o falsificar sesiones.

**Mitigación:**

- Implementar JWT (`jsonwebtoken`) con firma HMAC o RSA
- Incluir payload con `userId`, `email`, `iat`, `exp`
- Establecer expiración adecuada (ej: 1 hora para access token)
- Implementar refresh tokens para renovación segura

**Ejemplo:**

```js
import jwt from "jsonwebtoken";
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "1h" },
);
```

---

### 🟠 ALTAS

#### V-05: Exposición de Información en Mensajes de Error

**Archivo:** `api-server/index.js` (línea 162)

```js
res
  .status(500)
  .json({ error: "Error al conectar con el AS/400: " + error.message });
```

**Problema:** Se incluye el mensaje de error completo en la respuesta HTTP, lo que puede revelar detalles internos del sistema (nombres de tablas, estructura de la base de datos, etc.).

**Riesgo:** Ingeniería inversa facilitada para atacantes.

**Mitigación:**

- No exponer detalles internos en respuestas de error
- Registrar el error completo en logs internos
- Devolver mensajes genéricos al cliente

```js
logger.error({ err: error }, "Error al conectar con el AS/400");
res.status(500).json({ error: "Error interno del servidor" });
```

---

#### V-06: Código de Validación Hardcodeado

**Archivo:** `src/features/validar/pages/ValidarClientes.tsx` (línea 14)

```ts
codVal: "VAL",
```

**Problema:** El código de validación (`codVal`) está hardcodeado como `"VAL"`. No hay entrada del usuario ni lógica para determinar este valor. Esto significa que la validación no es realmente funcional — siempre se envía el mismo código.

**Riesgo:** El stored procedure recibe siempre el mismo código de validación, lo que podría anular el propósito del SP si se espera un código dinámico o por usuario.

**Mitigación:**

- Revisar si este campo debe ser ingresado por el usuario, generado por el servidor, o eliminado
- Si es necesario, implementar una entrada segura (ej: código enviado por correo/SMS)
- Documentar el propósito real del campo `codVal`

---

#### V-07: Endpoint sin Protección contra CSRF

**Problema:** No hay tokens CSRF ni mecanismos anti-CSRF en ningún formulario o endpoint.

**Riesgo:** Un atacante podría engañar a un usuario autenticado para que ejecute acciones no deseadas.

**Mitigación:**

- Implementar tokens CSRF para formularios
- Usar cookies con `SameSite=Strict` o `SameSite=Lax`
- Validar el origen de las peticiones con headers `Origin`/`Referer`

---

### 🟡 MEDIAS

#### V-08: Datos Sensibles en localStorage sin Protección

**Archivo:** `src/features/auth/store.ts`

```ts
persist(
  (set) => ({...}),
  { name: "auth-storage", partialize: (state) => ({ user: state.user }) },
)
```

**Problema:** El objeto `user` completo (incluyendo email y token) se almacena en localStorage. Cualquier script en la página (incluso de terceros) puede acceder a esta información mediante XSS.

**Riesgo:** Robo de sesión si hay una vulnerabilidad XSS en la aplicación o en dependencias.

**Mitigación:**

- Usar cookies httpOnly para el token de acceso
- No almacenar información sensible en localStorage
- Si se debe usar localStorage, encriptar los datos antes de persistirlos
- Implementar Content Security Policy (CSP) estricta

---

#### V-09: Ausencia de Content Security Policy (CSP)

**Archivo:** `api-server/index.js` (línea 102)

```js
app.use(helmet());
```

**Problema:** Helmet se usa con configuración predeterminada. No se define una CSP personalizada.

**Riesgo:** Mayor superficie de ataque para XSS, inyección de scripts, y clickjacking.

**Mitigación:**

```js
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", process.env.CORS_ORIGIN],
    },
  }),
);
```

---

#### V-10: Sin HTTPS en Ningún Entorno

**Problema:** Tanto el frontend (Vite dev) como el backend (Express) se ejecutan sobre HTTP. No hay configuración de HTTPS.

**Riesgo:** Intercepción de tráfico (man-in-the-middle), robo de credenciales y tokens.

**Mitigación:**

- Configurar HTTPS en producción con certificados válidos (Let's Encrypt)
- Usar un reverse proxy (nginx, Caddy) para terminar SSL
- En desarrollo, usar `vite --https` para simular HTTPS

---

#### V-11: Sin Validación de Longitud en el Frontend

**Archivo:** `src/features/validar/pages/ValidarClientes.tsx`

**Problema:** Aunque el backend valida longitudes máximas (Zod schema), el frontend no impide enviar datos excesivamente largos en los campos de texto.

**Riesgo:** Posible ataque de buffer overflow o denial of service, aunque mitigado por el límite de 10kb en el body parser.

**Mitigación:**

- Agregar `maxLength` a los inputs del formulario
- Validar longitudes en el frontend antes de enviar

---

#### V-12: Endpoint `/health` Sin Rate Limiting

**Archivo:** `api-server/index.js`

```js
app.get('/health', (_req, res) => { ... });
```

**Problema:** El rate limiter solo se aplica a rutas bajo `/api/`. El endpoint `/health` no tiene protección.

**Riesgo:** Ataque de denegación de servicio dirigido al health check.

**Mitigación:**

- Aplicar rate limiting global o mover `/health` bajo `/api/health`

---

### 🟢 BAJAS

#### V-13: CORS con Origen Fijo en Producción

**Archivo:** `api-server/index.js` (línea 103)

```js
app.use(cors({ origin: env.CORS_ORIGIN }));
```

**Problema:** CORS está configurado correctamente para un solo origen, pero en producción debería permitir múltiples orígenes.

**Riesgo:** Bajo (ya que usa variable de entorno), pero la configuración es restrictiva.

**Mitigación:**

- Usar un array de orígenes permitidos desde variable de entorno
- No usar comodín `*` en producción

---

#### V-14: Código Muerto - `src/App.tsx` con Template de Vite

**Archivo:** `src/App.tsx`

**Problema:** El archivo `App.tsx` contiene el template por defecto de Vite (contador, logos), que no se usa. La aplicación real arranca desde `main.tsx` directamente con el router.

**Riesgo:** Confusión para desarrolladores nuevos. Posiblemente aumenta el tamaño del bundle si se importa accidentalmente.

**Mitigación:**

- Eliminar `App.tsx` y limpiar referencias
- O actualizarlo para que sea el entry point real

---

#### V-15: Endpoint Mismatch en `clienteService.ts`

**Archivo:** `src/services/clienteService.ts`

```ts
await api.post("ClientFormt/validar", datos);
```

**Problema:** El servicio apunta a `ClientFormt/validar` (sin prefijo `/api/`), mientras que el backend espera `/api/clientes/validar`. Además, este archivo parece no ser usado por las páginas principales (usan `features/dashboard/services.ts`).

**Riesgo:** Código legacy que puede causar confusión o errores si alguien lo importa.

**Mitigación:**

- Eliminar el archivo si no se usa
- O corregir la ruta y migrar las páginas a usarlo

---

#### V-16: Comentarios Confidenciales en Código

**Problema:** Se encontraron comentarios como `pub400` y `msantos02` en las credenciales de conexión, que exponen información del sistema.

**Riesgo:** Bajo si el `.env` está en `.gitignore`, pero el daño ya está hecho si se ha commiteado en algún momento.

**Mitigación:**

- Usar `git filter-branch` o `BFG Repo-Cleaner` para eliminar secretos del historial de git
- Rotar las credenciales expuestas
- Revisar que `.env` esté en `.gitignore` (ya lo está)

---

## 12. Recomendaciones Técnicas

### 12.1 Prioridades de Implementación

| Prioridad | Vulnerabilidad                   | Esfuerzo | Impacto |
| --------- | -------------------------------- | -------- | ------- |
| 🔴 1      | V-03: Autenticación en endpoints | Medio    | Crítico |
| 🔴 2      | V-02: Contraseñas en texto plano | Bajo     | Crítico |
| 🔴 3      | V-04: Token predecible           | Medio    | Crítico |
| 🔴 4      | V-01: Credenciales BD en plano   | Bajo     | Crítico |
| 🟠 5      | V-05: Exposición de errores      | Bajo     | Alto    |
| 🟠 6      | V-06: Código hardcodeado         | Bajo     | Alto    |
| 🟠 7      | V-07: CSRF                       | Medio    | Alto    |
| 🟡 8      | V-08: localStorage               | Bajo     | Medio   |
| 🟡 9      | V-09: CSP                        | Bajo     | Medio   |
| 🟡 10     | V-10: HTTPS                      | Medio    | Medio   |
| 🟢 11-16  | Resto                            | Bajo     | Bajo    |

### 12.2 Mejores Prácticas Adicionales

1. **Logging seguro**: No registrar información sensible como contraseñas o tokens. Pino actualmente loggea los datos enviados al SP (`logger.info({ datos }, 'Enviando datos al procedimiento')`).

2. **Principio de mínimo privilegio**: La cuenta Mapepire usada en la conexión debería tener solo los permisos necesarios para ejecutar `SP_VALIDTC` y leer `TABCLI03`.

3. **Validación de entrada**: Agregar sanitización en el frontend contra XSS (escape de caracteres HTML en los campos de texto).

4. **Dependencias**: Revisar versiones de dependencias regularmente con `npm audit`. Considerar agregar Dependabot o Renovate para PRs automáticos.

5. **Headers de seguridad adicionales**:
   - `X-Frame-Options: DENY` (ya incluido por helmet)
   - `X-Content-Type-Options: nosniff` (ya incluido por helmet)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy` para restringir APIs del navegador

6. **Gestión de secretos**: Usar un servicio de gestión de secretos (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) en lugar de variables de entorno con valores estáticos.

7. **Rate limiting global**: Aplicar rate limiting a todas las rutas, incluyendo `/health`.

8. **Separación de ambientes**: Crear archivos `.env.development`, `.env.production` con configuraciones diferenciadas.

9. **Monitoreo de seguridad**: Implementar registro y monitoreo de intentos de autenticación fallidos (actualmente no se trackean).

10. **Cifrado de datos en tránsito**: Configurar TLS en Mapepire Server (`rejectUnauthorized: true`) y HTTPS en el servidor Express.

### 12.3 Roadmap Sugerido

```
Fase 1 (Inmediata - 1 semana)
├── Implementar autenticación real en API (JWT)
├── Hashing de contraseñas (bcrypt)
├── Rotar credenciales de BD expuestas
└── Deshabilitar errores detallados

Fase 2 (Corto plazo - 2 semanas)
├── Revisar y eliminar código hardcodeado
├── Configurar CSP y HTTPS
├── Implementar refresh tokens
└── Agregar validación de longitud en frontend

Fase 3 (Mediano plazo - 1 mes)
├── Migrar a cookies httpOnly para sesiones
├── Implementar CSRF tokens
├── Auditoría de dependencias
└── Penetration testing

Fase 4 (Largo plazo)
├── Migrar a base de datos persistente (PostgreSQL, etc.)
├── Implementar 2FA
├── Sistema de roles y permisos (RBAC)
└── Auditoría de seguridad externa
```

---

## Apéndice A: Comandos Útiles

```bash
# Desarrollo local completo
npm run dev:full

# Build de producción
npm run build

# Ejecutar linter
npm run lint

# Auditoría de seguridad de dependencias
npm audit

# Tests
npm test                    # Unitarios
npm run test:coverage       # Unitarios con cobertura
npm run test:e2e            # E2E (Playwright)
npm run test:e2e:ui         # E2E con UI interactiva
```

## Apéndice B: Referencias

- [OWASP Top 10 - 2021](https://owasp.org/www-project-top-ten/)
- [JWT.io - JSON Web Tokens](https://jwt.io/)
- [Helmet.js - Security Headers](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

---

_Documento generado para propósitos de documentación y auditoría de seguridad. Revisión recomendada: trimestral._
