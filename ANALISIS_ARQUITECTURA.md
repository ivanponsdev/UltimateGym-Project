# Análisis de Arquitectura - UltimateGym

**Documento de análisis extenso de la arquitectura, funcionamiento e integración del proyecto UltimateGym**

---

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Frontend - React](#frontend---react)
6. [Backend - Express/Node.js](#backend---expressnodejs)
7. [Base de Datos - MongoDB](#base-de-datos---mongodb)
8. [Flujos de Datos](#flujos-de-datos)
9. [Autenticación y Seguridad](#autenticación-y-seguridad)
10. [Gestión de Archivos](#gestión-de-archivos)
11. [Integraciones Externas](#integraciones-externas)
12. [Optimizaciones y Fixes Realizados](#optimizaciones-y-fixes-realizados)

---

## Visión General

**UltimateGym** es una aplicación web de gestión de gimnasio completa que permite a usuarios e instructores:

- **Usuarios**: Registrarse, ver su perfil, inscribirse en clases, acceder a guías de ejercicios, ver estadísticas personales
- **Instructores**: Crear y gestionar clases
- **Administradores**: Gestionar todo (usuarios, clases, ejercicios, guías, estadísticas)
- **Chatbot**: Asistente virtual (Paco) que interactúa con usuarios

### Casos de Uso Principales

```
┌─────────────────────────────────────────────────────┐
│            ULTIMAGYM - Casos de Uso                  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  USUARIO ANÓNIMO                                     │
│  ├─ Ver landing page                                │
│  ├─ Registrarse                                      │
│  └─ Iniciar sesión                                   │
│                                                       │
│  USUARIO AUTENTICADO                                │
│  ├─ Ver dashboard personal                          │
│  ├─ Editar perfil                                    │
│  ├─ Inscribirse/desinscribirse de clases           │
│  ├─ Ver guías de ejercicios                          │
│  ├─ Ver estadísticas personales                      │
│  ├─ Interactuar con chatbot Paco                     │
│  └─ Descargar guías en PDF                           │
│                                                       │
│  ADMINISTRADOR                                       │
│  ├─ Dashboard de estadísticas                        │
│  ├─ Gestionar usuarios (CRUD)                        │
│  ├─ Gestionar clases (CRUD)                          │
│  ├─ Gestionar ejercicios con imágenes (CRUD)        │
│  ├─ Gestionar guías en PDF (CRUD)                    │
│  ├─ Ver logs de actividad                            │
│  └─ Exportar datos                                   │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

### Frontend
- **React 18.x** - Librería de UI con component-based architecture
- **Vite** - Build tool moderno y rápido
- **Axios** - Cliente HTTP para comunicación con backend
- **Recharts** - Gráficos interactivos (pie charts, line charts, bar charts)
- **CSS3** - Estilos personalizados con variables CSS para temas accesibles

### Backend
- **Node.js** - Runtime JavaScript
- **Express 4.21.2** - Framework web
- **MongoDB 8.19.2** - Base de datos NoSQL
- **Mongoose** - ODM (Object Database Mapping) para MongoDB
- **JWT (jsonwebtoken)** - Autenticación sin estado
- **Multer 2.0.2** - Middleware para carga de archivos
- **bcrypt** - Hash seguro de contraseñas
- **dotenv** - Gestión de variables de entorno

### Librerías Externas
- **LandBot** - Chatbot widget (Desktop: Container, Mobile: Livechat)
- **Font Awesome / Iconos SVG** - Íconos UI

### Herramientas de Desarrollo
- **npm** - Gestor de paquetes
- **VS Code** - IDE

---

## Arquitectura de Alto Nivel

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                         │
├──────────────────────────────────────────────────────────────────┤
│                     Frontend React + Vite                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Landing → Auth → Dashboard (Users/Admin) → Modales/       │  │
│  │  Notificaciones + Gráficos + LandBot Widget              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          ↓ HTTP(S)                                │
│                    (Axios REST API)                               │
│                          ↓                                        │
├──────────────────────────────────────────────────────────────────┤
│                    RED / INTERNET                                 │
├──────────────────────────────────────────────────────────────────┤
│                         SERVIDOR                                  │
├──────────────────────────────────────────────────────────────────┤
│                   Express.js API Server                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Routes (Auth, Usuarios, Clases, Ejercicios, Guías, etc) │  │
│  │  Controllers (Lógica de negocio)                          │  │
│  │  Middleware (JWT, Validation, Multer)                     │  │
│  │  Models (Mongoose Schemas)                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  MongoDB Database                                          │  │
│  │  ├─ Usuarios                                               │  │
│  │  ├─ Clases                                                 │  │
│  │  ├─ Ejercicios                                             │  │
│  │  ├─ Guías                                                  │  │
│  │  └─ InteraccionPaco (Tracking del chatbot)                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Sistema de Archivos                                       │  │
│  │  ├─ /backend/uploads/guias/*.pdf                          │  │
│  │  ├─ /backend/uploads/ejercicios/*.jpg/.png               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Servicios Externos                                        │  │
│  │  ├─ LandBot (Chatbot Widget)                              │  │
│  │  ├─ Correo (Email API)                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Estructura del Proyecto

```
UltimateGym/
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración Vite
├── README.md                 # Documentación del proyecto
│
├── backend/                  # Servidor Express
│   ├── server.js             # Punto de entrada del servidor
│   ├── config/
│   │   └── db.js             # Configuración MongoDB
│   ├── models/               # Schemas Mongoose
│   │   ├── Usuario.js        # Schema de usuarios con validaciones
│   │   ├── Clase.js          # Schema de clases
│   │   ├── Ejercicio.js      # Schema de ejercicios con imágenes
│   │   └── Guia.js           # Schema de guías PDF
│   ├── controllers/          # Lógica de negocio
│   │   ├── userController.js
│   │   ├── claseController.js
│   │   ├── ejercicioController.js
│   │   ├── guiaController.js
│   │   ├── statsController.js
│   │   ├── emailController.js
│   │   └── exportController.js
│   ├── routes/               # Definición de endpoints
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── claseRoutes.js
│   │   ├── ejercicioRoutes.js
│   │   ├── guiaRoutes.js
│   │   ├── statsRoutes.js
│   │   ├── emailRoutes.js
│   │   └── exportRoutes.js
│   ├── middleware/
│   │   └── auth.js           # Autenticación JWT
│   ├── seeds/                # Datos iniciales de prueba
│   │   ├── index.js
│   │   ├── usuariosSeed.js
│   │   ├── clasesSeed.js
│   │   ├── ejerciciosSeed.js
│   │   └── guiasSeed.js
│   ├── uploads/              # Almacenamiento de archivos
│   │   ├── guias/            # PDFs de guías
│   │   └── ejercicios/       # Imágenes de ejercicios
│   └── .env                  # Variables de entorno (no incluido en git)
│
├── frontend-react/           # Aplicación React
│   ├── index.html            # HTML principal
│   ├── vite.config.js        # Config específica Vite (si aplica)
│   ├── src/
│   │   ├── main.jsx          # Punto de entrada
│   │   ├── App.jsx           # Componente raíz con routing
│   │   │
│   │   ├── pages/            # Páginas/vistas
│   │   │   ├── Landing.jsx   # Página de inicio pública
│   │   │   ├── Auth.jsx      # Login/Registro
│   │   │   ├── Dashboard.jsx # Dashboard usuario
│   │   │   ├── AdminDashboard.jsx  # Dashboard admin
│   │   │   └── Info.jsx      # Página de información
│   │   │
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── CustomModal.jsx       # Modal con iconos semánticos
│   │   │   ├── Notification.jsx      # Toast notifications
│   │   │   ├── ProtectedRoute.jsx    # Validación de rutas privadas
│   │   │   ├── Sidebar.jsx           # Menú lateral
│   │   │   ├── FloatingLogo.jsx      # Logo flotante
│   │   │   ├── LandBotWidget.jsx     # Integración chatbot Paco
│   │   │   ├── CardComponents.jsx    # Cards para contenido
│   │   │   ├── Footer.jsx            # Pie de página
│   │   │   ├── SkipLink.jsx          # Accesibilidad (Skip to content)
│   │   │   ├── AccesibilidadWidget.jsx # Widget de accesibilidad
│   │   │   └── charts/
│   │   │       ├── GraficoBarras.jsx
│   │   │       ├── GraficoCircular.jsx
│   │   │       └── GraficoLineal.jsx
│   │   │
│   │   ├── context/          # Context API (estado global)
│   │   │   ├── AuthContext.jsx       # Estado de autenticación
│   │   │   └── AccessibilityContext.jsx # Configuración accesibilidad
│   │   │
│   │   ├── services/         # Servicios API
│   │   │   └── api.js        # Configuración Axios + endpoints
│   │   │
│   │   └── styles/           # Estilos globales y por componente
│   │       ├── index.css
│   │       ├── app.css
│   │       ├── variables.css # Colores, fuentes, tokens
│   │       ├── base.css
│   │       ├── buttons.css
│   │       ├── accesible.css
│   │       └── accessibility-tooltip.css
│   │
│   └── public/               # Archivos estáticos

```

---

## Frontend - React

### 1. Arquitectura de Componentes

#### App.jsx - Enrutamiento Principal
```jsx
App (routing principal)
├─ Landing (ruta pública: /)
├─ Auth (ruta pública: /login, /register)
├─ ProtectedRoute
│  ├─ Dashboard (privada, usuario: /dashboard)
│  ├─ AdminDashboard (privada, admin: /admin)
│  └─ Info (privada: /info)
└─ Componentes transversales
   ├─ Sidebar (navegación)
   ├─ Footer
   ├─ LandBotWidget (chatbot Paco)
   └─ FloatingLogo
```

#### Context API - Gestión de Estado Global

**AuthContext.jsx** - Maneja:
- Usuario autenticado (datos, rol, token JWT)
- Funciones de login/logout/registro
- Persistencia de sesión (localStorage)

```javascript
// Flujo de autenticación
1. Usuario escribe email/contraseña
2. Frontend hace POST /api/auth/login
3. Backend retorna { token, user }
4. Frontend almacena token en localStorage
5. AuthContext actualiza estado global
6. ProtectedRoute valida acceso basándose en rol
```

**AccessibilityContext.jsx** - Maneja:
- Temas visuales (alto contraste, modo oscuro)
- Tamaño de fuente
- Preferencias de accesibilidad

### 2. Componentes Principales

#### CustomModal.jsx
Componente modal reutilizable con **iconografía semántica**:

```jsx
Props:
- type: "alert" | "confirm"
- message: string
- iconType: "success" | "error" | "warning"
- isOpen: boolean
- onConfirm: función
- onCancel: función

Iconos:
✓ Verde (éxito)      - Operaciones exitosas
✗ Rojo (error)      - Errores y validaciones
⚠ Amarillo (warning) - Confirmaciones destructivas

Comportamiento:
- ESC cierra el modal
- Click fuera cierra (contexto alert)
- Confirm y Cancel son botones explícitos
```

#### Notification.jsx
Toast auto-desaparición (3s) con iconos:

```jsx
Props:
- type: "success" | "error" | "info" | "warning"
- message: string
- onClose: función

Uso: Mostrar feedback después de acciones (login success, error, etc.)
```

#### LandBotWidget.jsx - Chatbot Paco

**Integración LandBot**:
- Desktop → LandBot Container (widget customizado)
- Mobile → LandBot Livechat (popup livechat)

**Tracking de Interacciones**:
```javascript
// Problema inicial: Contaba cada page load como interacción
// Solución: sessionStorage + click listener

registrarInteraccion() {
  // Solo registra la PRIMERA interacción por sesión
  if (!sessionStorage.getItem('paco_interaccion_registrada')) {
    // Llamada API para guardar en BD
    sessionStorage.setItem('paco_interaccion_registrada', 'true')
  }
}

// En desktop: addEventListener('click', registrarInteraccion, { once: true })
// En mobile: onClick es del button primario
```

#### Gráficos (Recharts)

**GraficoCircular.jsx** - Pie Chart
```javascript
// Problema: Mostraba conteos como porcentajes (5%, 6%, 6%)
// Solución: Calcular real y mostrar (29%, 33%, 38%)

total = array.reduce((sum, item) => sum + item[dataKey], 0)
percentage = Math.round((item[dataKey] / total) * 100)
```

**GraficoLineal.jsx** - Line Chart (evolución temporal)

**GraficoBarras.jsx** - Bar Chart (comparativas)

### 3. Flujo de Datos - Dashboard Usuario

```
Dashboard.jsx (componente principal del usuario)
│
├─ useEffect (onLoad)
│  └─ Cargar: Perfil + Clases disponibles + Clases inscritas + Ejercicios + Guías
│
├─ handleEditProfile
│  ├─ Validar (nombre, edad, sexo, objetivo, password)
│  ├─ Si error → setModalConfig({ iconType: 'error', message })
│  └─ Si OK → PUT /api/usuarios/:id → setModalConfig({ iconType: 'success' })
│
├─ handleInscribirse(claseId)
│  ├─ POST /api/clases/:id/inscribirse
│  └─ Si error → Modal error | Si OK → Modal success + refresh
│
├─ handleDesinscribirse(claseId)
│  ├─ Modal confirm (warning)
│  └─ DELETE → Modal success/error
│
└─ Rendering
   ├─ Perfil section
   ├─ Clases disponibles (cards)
   ├─ Mis clases (cards inscritas)
   ├─ Ejercicios (grid de cards)
   ├─ Guías (cards con descarga PDF)
   ├─ Estadísticas (gráficos)
   ├─ Chat Paco
   └─ CustomModal + Notification
```

---

## Backend - Express/Node.js

### 1. Arquitectura de Rutas

```
express()
├─ CORS + JSON middleware
├─ Static files: /uploads → backend/uploads/
│
├─ /api/auth
│  ├─ POST /register → Crear usuario
│  ├─ POST /login → Validar credenciales + generar JWT
│  └─ POST /logout
│
├─ /api/usuarios
│  ├─ GET / → [admin] Listar todos
│  ├─ GET /:id → [auth] Ver perfil propio o admin
│  ├─ PUT /:id → [auth] Editar perfil
│  ├─ DELETE /:id → [admin] Eliminar usuario
│  └─ POST / → [admin] Crear nuevo usuario
│
├─ /api/clases
│  ├─ GET / → Listar todas (paginado)
│  ├─ GET /:id → Detalles
│  ├─ POST / → [admin] Crear
│  ├─ PUT /:id → [admin] Editar
│  ├─ DELETE /:id → [admin] Eliminar
│  ├─ POST /:id/inscribirse → [auth] Inscribirse
│  └─ DELETE /:id/desinscribirse → [auth] Desinscribirse
│
├─ /api/ejercicios
│  ├─ GET / → Listar todos
│  ├─ POST / → [admin + Multer] Crear (con imagen)
│  ├─ PUT /:id → [admin + Multer] Editar
│  └─ DELETE /:id → [admin] Eliminar
│
├─ /api/guias
│  ├─ GET / → Listar todas
│  ├─ POST / → [admin + Multer] Crear (PDF)
│  ├─ PUT /:id → [admin + Multer] Editar
│  └─ DELETE /:id → [admin] Eliminar
│
├─ /api/stats
│  ├─ GET /usuarios → [admin] Estadísticas de usuarios
│  ├─ GET /clases → [admin] Estadísticas de clases
│  ├─ GET /ejercicios → [admin] Estadísticas de ejercicios
│  └─ GET /paco → Interacciones chatbot
│
├─ /api/export
│  ├─ GET /usuarios → [admin] Descargar CSV usuarios
│  ├─ GET /clases → [admin] Descargar CSV clases
│  └─ GET /stats → [admin] Descargar CSV estadísticas
│
└─ [SIN USAR] /api/email (deshabilitado o en construction)
```

### 2. Middleware de Autenticación

**auth.js**

```javascript
authenticateJWT(req, res, next) {
  1. Extraer token del header: "Authorization: Bearer TOKEN"
  2. Verificar token con SECRET
  3. Si válido → req.user = payload (id, email, rol)
  4. Si inválido → 401 Unauthorized
}

requireAdmin(req, res, next) {
  1. Validar que req.user existe (correr authenticateJWT primero)
  2. Validar que req.user.rol === "admin"
  3. Si no es admin → 403 Forbidden
}

requireAuth = [authenticateJWT] 
requireAuthAndAdmin = [authenticateJWT, requireAdmin]
```

**Orden importante en rutas**:
```javascript
// ✓ CORRECTO - Proteger antes de parsear body
router.delete('/:id', authenticateJWT, requireAdmin, controller.delete)

// ✗ INCORRECTO - Multer antes de auth pierde contexto
router.post('/', authenticateJWT, upload.single('file'), controller.create)
```

### 3. Gestión de Archivos con Multer

**Configuración en routes**:

```javascript
const upload = multer({
  storage: multer.diskStorage({
    destination: 'backend/uploads/ejercicios/',  // Ruta absoluta
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  }),
  fileFilter: (req, file, cb) => {
    // Validaciones MIME type
    cb(null, true)
  }
})

router.post('/', 
  authenticateJWT,    // 1. Autenticar
  requireAdmin,       // 2. Autorizar
  upload.single('file'),  // 3. Procesar archivo
  create              // 4. Controller
)
```

**Normalización de rutas en Controller**:

```javascript
// Multer guarda en: backend/uploads/ejercicios/1234567890.jpg
// Path retorna: backend\uploads\ejercicios\1234567890.jpg (Windows)
// Necesitamos: uploads/ejercicios/1234567890.jpg

const normalizePath = (filePath) => 
  filePath
    .replace(/\\/g, '/')           // Windows: \ → /
    .replace(/^backend\//, '')      // Quitar prefijo backend/

// En BD guardamos: uploads/ejercicios/1234567890.jpg
// Frontend construye: /uploads/ejercicios/1234567890.jpg
// Express sirve: /uploads (mapped à backend/uploads/)
```

### 4. Controllers - Lógica de Negocio

#### userController.js

**Crear usuario**:
```javascript
1. Validar formato email, nombre, edad
2. Hash password con bcrypt (10 rounds)
3. Crear documento Usuario en BD
4. Return usuario creado (sin password)
5. Catch → return error con código HTTP
```

**Actualizar usuario**:
```javascript
1. Validar que usuario editando es él mismo o es admin
2. Validaciones de entrada (si changes)
3. Si nuevo password: hash con bcrypt
4. updateOne en BD
5. Retornar usuario actualizado (sin mostrar password)
```

#### ejercicioController.js

**Crear ejercicio con imagen**:
```javascript
1. req.file contiene imagen uploadada (Multer)
2. Normalizar path: req.file.path → "uploads/ejercicios/..."
3. Crear documento:
   {
     nombre,
     descripcion,
     grupoMuscular,
     dificultad,
     imagen: "uploads/ejercicios/...",
     instrucciones
   }
4. Return URL accesible: /uploads/ejercicios/...
```

**Actualizar ejercicio**:
```javascript
1. Si nueva imagen:
   a. Normalizar path
   b. Eliminar archivo viejo del disco
   c. Guardar nuevo path
2. Else: mantener imagen anterior
3. updateOne
```

**Eliminar ejercicio**:
```javascript
1. Buscar documento para obtener path de imagen
2. Unlink (eliminar archivo físico)
3. deleteOne en BD
```

#### guiaController.js

Idéntico a ejercicio pero con:
- Validación extensión: `.pdf` solo
- Normalization igual
- Storage en `backend/uploads/guias/`

#### statsController.js

```javascript
// Contar usuarios por objetivo
aggregate([
  { $group: { _id: '$objetivo', count: { $sum: 1 } } }
])

// Contar inscripciones por clase
aggregate([
  { $unwind: '$usuarios' },
  { $group: { _id: '$_id', count: { $sum: 1 } } }
])

// Últimas interacciones Paco
InteraccionPaco.find().sort({ createdAt: -1 }).limit(10)
```

### 5. Modelos Mongoose

**Usuario.js**
```javascript
usuarioSchema = {
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  edad: Number,
  sexo: enum: ['Hombre', 'Mujer', 'Otro'],
  objetivo: enum: ['Pérdida de peso', 'Ganancia muscular', ...],
  rol: enum: ['user', 'instructor', 'admin'],
  clases: [ObjectId] → referencia a Clase
}

Métodos:
- comparePassword(rawPassword) → bcrypt.compare
- toJSON() → excluye password
```

**Clase.js**
```javascript
claseSchema = {
  nombre: String,
  descripcion: String,
  diaSemana: enum: ['lunes', 'martes', ...],
  horaInicio: String (HH:mm),
  horaFin: String (HH:mm),
  profesor: String,
  cupoMaximo: Number,
  usuarios: [ObjectId] → Usuario inscrito,
  activa: Boolean,
  timestamps: true
}
```

**Ejercicio.js**
```javascript
ejercicioSchema = {
  nombre: String,
  descripcion: String,
  grupoMuscular: String,
  dificultad: enum: ['Fácil', 'Intermedio', 'Difícil'],
  imagen: String → "uploads/ejercicios/...",
  instrucciones: String,
  timestamps: true
}
```

**Guia.js**
```javascript
guiaSchema = {
  nombre: String,
  descripcion: String,
  objetivo: String,
  archivoUrl: String → "uploads/guias/...",
  creador: ObjectId → Usuario admin,
  timestamps: true
}
```

---

## Base de Datos - MongoDB

### Estructura de Colecciones

```
UltimateGym (base de datos)
├─ usuarios (collection)
│  ├─ _id: ObjectId
│  ├─ nombre: "Juan Pérez"
│  ├─ email: "juan@example.com"
│  ├─ password: "$2b$10$..." (hash bcrypt)
│  ├─ edad: 25
│  ├─ sexo: "Hombre"
│  ├─ objetivo: "Ganancia muscular"
│  ├─ rol: "user"
│  ├─ clases: [ObjectId, ObjectId, ...]
│  └─ createdAt: ISODate
│
├─ clases (collection)
│  ├─ _id: ObjectId
│  ├─ nombre: "CrossFit matutino"
│  ├─ descripcion: "Clase de CrossFit..."
│  ├─ diaSemana: "lunes"
│  ├─ horaInicio: "07:00"
│  ├─ horaFin: "08:00"
│  ├─ profesor: "Carlos López"
│  ├─ cupoMaximo: 20
│  ├─ usuarios: [ObjectId, ObjectId, ...]
│  ├─ activa: true
│  └─ timestamps
│
├─ ejercicios (collection)
│  ├─ _id: ObjectId
│  ├─ nombre: "Press de banca"
│  ├─ descripcion: "..."
│  ├─ grupoMuscular: "Pecho"
│  ├─ dificultad: "Intermedio"
│  ├─ imagen: "uploads/ejercicios/1708079265921.jpg"
│  ├─ instrucciones: "1. Tumbarse en banco..."
│  └─ timestamps
│
├─ guias (collection)
│  ├─ _id: ObjectId
│  ├─ nombre: "Guía de Iniciante"
│  ├─ descripcion: "..."
│  ├─ objetivo: "Pérdida de peso"
│  ├─ archivoUrl: "uploads/guias/1708079265921.pdf"
│  ├─ creador: ObjectId (Usuario)
│  └─ timestamps
│
└─ interaccionpacos (collection)
   ├─ _id: ObjectId
   ├─ usuarioId: ObjectId
   ├─ timestamp: ISODate
   └─ detalles: { ... }
```

### Indexación

```javascript
// Usuarios - búsqueda rápida por email
usuarioSchema.index({ email: 1 })

// Clases - búsqueda por día de la semana
claseSchema.index({ diaSemana: 1 })
```

---

## Flujos de Datos

### Flujo 1: Registro e Inicio de Sesión

```
1. USUARIO EN FRONTEND
   └─ Completa form: email, password, nombre, edad, sexo, objetivo
   └─ Click "Registrarse"

2. FRONTEND VALIDA
   └─ Regex email
   └─ Password strength
   └─ Campos requeridos

3. FRONTEND → BACKEND
   └─ POST /api/auth/register
   └─ Body: { email, password, nombre, edad, sexo, objetivo }

4. BACKEND VALIDA
   └─ Email único
   └─ Password hashing bcrypt
   └─ Crear documento Usuario (rol: 'user')

5. BACKEND → FRONTEND
   └─ 201 Created
   └─ Body: { token: "eyJhbGc...", user: { id, email, nombre, rol } }

6. FRONTEND GUARDA
   └─ localStorage.setItem('token', token)
   └─ AuthContext.setUser(user)
   └─ Navigate('/dashboard')

7. DASHBOARD CARGA
   └─ useEffect llama GET /api/usuarios/profile
   └─ Header incluye: Authorization: Bearer TOKEN
   └─ Backend valida JWT, retorna datos usuario

8. USUARIO VE SU DASHBOARD
   └─ Clases disponibles
   └─ Ejercicios
   └─ Guías
   └─ Estadísticas personales
```

### Flujo 2: Inscripción en Clase

```
1. USUARIO VE CLASE
   └─ Card muestra: nombre, horario, profesor, cupo, botón "Inscribirse"

2. USUARIO CLICK "INSCRIBIRSE"
   └─ Frontend: POST /api/clases/:claseId/inscribirse
   └─ Header: Authorization: Bearer TOKEN

3. BACKEND PROCESA
   └─ authenticateJWT: extrae usuarioId del token
   └─ Busca Clase
   └─ Valida cupo: usuarios.length < cupoMaximo
   └─ Push usuarioId a clase.usuarios
   └─ Push claseId a usuario.clases
   └─ Save ambos documentos

4. RESPUESTA
   └─ 200 OK
   └─ Body: { message: "Inscrito correctamente" }

5. FRONTEND ACTUALIZA
   └─ setModalConfig({ iconType: 'success', message: 'Inscrito' })
   └─ refreshClases() → GET /api/clases
   └─ UI actualiza "Mis clases"

6. USUARIO VE CAMBIOS
   └─ Clase aparece en "Mis clases"
   └─ Botón cambia de "Inscribirse" a "Desinscribirse"
```

### Flujo 3: Crear Ejercicio (Admin + Upload)

```
1. ADMIN FORM
   ├─ Nombre, descripción
   ├─ Grupo muscular (dropdown)
   ├─ Dificultad
   ├─ Input file (image) → onChange: setEjercicioForm({ ...form, imagen: file })
   └─ Click "Guardar"

2. FRONTEND VALIDA
   ├─ Campos requeridos
   ├─ Tipo archivo: image/jpeg, image/png
   └─ Tamaño < 5MB

3. FRONTEND CREA FormData
   ├─ Append 'nombre'
   ├─ Append 'descripcion'
   ├─ Append 'imagen' (File object)
   └─ POST /api/ejercicios
   └─ Body: multipart/form-data

4. BACKEND (Multer)
   ├─ Middleware Multer intercepta request
   ├─ Valida MIME type
   ├─ Copia archivo a: backend/uploads/ejercicios/1708079265921.jpg
   ├─ req.file = { filename, path, size, ... }
   └─ Pasa a controller

5. BACKEND (Controller)
   ├─ Normaliza path: "backend\uploads\ejercicios\..." → "uploads/ejercicios/..."
   ├─ Crea documento:
   │  { nombre, descripcion, imagen: "uploads/ejercicios/...", ... }
   ├─ save() en BD
   └─ Retorna ejercicio creado

6. RESPUESTA
   ├─ 201 Created
   ├─ Body: { _id, nombre, imagen: "uploads/ejercicios/...", ... }

7. FRONTEND
   ├─ Modal: "Ejercicio creado correctamente" (iconType: success)
   ├─ setShowEjercicioModal(false)
   ├─ loadEjercicios() → GET /api/ejercicios
   └─ Grid se actualiza

8. EN RUNTIME
   ├─ Usuario ve ejercicio con imagen
   ├─ <img src={`/uploads/ejercicios/1708079265921.jpg`} />
   ├─ Express.static('/uploads') sirve archivo
   ├─ Imagen cargada desde disco: backend/uploads/ejercicios/1708079265921.jpg
```

### Flujo 4: Descargar Guía PDF

```
1. USUARIO VE GUÍA
   └─ Card muestra: nombre, descripción, botón "Descargar PDF"

2. USUARIO CLICK DESCARGAR
   └─ Frontend: GET /api/guias/:guiaId/download?token=TOKEN
   └─ O simple: <a href="/uploads/guias/filename.pdf" download />

3. OPCIÓN A: Simple (si está en /uploads pública)
   ├─ Express.static sirve
   ├─ Browser descarga o abre

4. OPCIÓN B: Controlado
   ├─ GET /api/guias/:id/download
   ├─ Backend valida autenticación
   ├─ res.download('/path/to/file.pdf')
   └─ Logging de descargas

5. RESULTADO
   └─ PDF descargado en máquina usuario
   └─ O abierto en navegador
```

---

## Autenticación y Seguridad

### JWT (JSON Web Token)

**Estructura JWT**:
```
header.payload.signature

header: { alg: "HS256", typ: "JWT" }
payload: { 
  id: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  rol: "user",
  iat: 1708079265,
  exp: 1708165665 (expira en 24h)
}
signature: HMAC-SHA256(header + payload + SECRET)
```

**Flujo Autenticación**:

```
1. USUARIO LOGIN
   └─ POST /api/auth/login
   └─ Body: { email, password }

2. BACKEND
   ├─ Busca usuario por email
   ├─ bcrypt.compare(password, usuarioHashedPassword)
   ├─ Si match:
   │  └─ jwt.sign({ id, email, rol }, SECRET, { expiresIn: '24h' })
   │  └─ Retorna token
   ├─ Si no match:
   │  └─ 401 Unauthorized

3. FRONTEND GUARDA TOKEN
   └─ localStorage.setItem('token', token)
   └─ AuthContext actualiza

4. SIGUIENTES REQUESTS
   ├─ GET /api/usuarios/profile
   ├─ Header: Authorization: Bearer eyJhbGc...
   ├─ Backend middleware:
   │  ├─ Extrae token del header
   │  ├─ jwt.verify(token, SECRET)
   │  ├─ Si válido: req.user = payload
   │  ├─ Si expirado: 401
   │  ├─ Si inválido: 401

5. LOGOUT
   ├─ Frontend: POST /api/auth/logout
   ├─ localStorage.removeItem('token')
   ├─ AuthContext.setUser(null)
   └─ Navigate('/login')
```

### Protecciones Implementadas

| Recurso | Protección | Motivo |
|---------|-----------|--------|
| `GET /api/usuarios` | authenticateJWT + requireAdmin | Solo admin ve todos |
| `PUT /api/usuarios/:id` | authenticateJWT | User se edita a sí o admin edita cualquiera |
| `POST /api/clases` | authenticateJWT + requireAdmin | Solo admin crea clases |
| `POST /api/ejercicios` | authenticateJWT + requireAdmin + Multer | Admin + validación archivo |
| `GET /api/export/*` | authenticateJWT + requireAdmin | Datos sensibles |
| `POST /api/clases/:id/inscribirse` | authenticateJWT | Usuarios autentificados |

### Validaciones de Frontend

```javascript
// Email: formato válido
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password: min 8 chars, mayús, minús, número
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

// Nombre: min 2 palabras, solo letras+espacios
/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+\s+[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
```

---

## Gestión de Archivos

### Multer - Upload de Archivos

**Problema a Resolver**:
- Guardar archivos en servidor
- Retornar URL accesible desde cliente
- Normalizar rutas (Windows vs Linux)

**Solución Implementada**:

1. **Multer diskStorage** → Guarda en `backend/uploads/`
2. **Express.static** → Sirve `/uploads` desde `backend/uploads/`
3. **Normalización en Controller** → `backend\path\to\file` → `path/to/file`
4. **BD almacena** → `uploads/ejercicios/1234.jpg`
5. **Frontend accede** → `<img src="/uploads/ejercicios/1234.jpg" />`

**Estructura Carpetas**:
```
backend/
├─ uploads/
│  ├─ ejercicios/
│  │  ├─ 1708079265921.jpg
│  │  ├─ 1708079265922.png
│  │  └─ ...
│  └─ guias/
│     ├─ 1708079265921.pdf
│     ├─ 1708079265922.pdf
│     └─ ...
```

**Rutas Multer en Código**:
```javascript
// ejercicioRoutes.js
const upload = multer({
  storage: multer.diskStorage({
    destination: 'backend/uploads/ejercicios/',  // Relativa a cwd
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
})

// Usando: /api/ejercicios (POST/PUT con imagen)
```

### Problemas Históricos y Soluciones

#### Problema 1: PDF Guides Serving Wrong Files
**Root Cause**: Multer guardaba en `backend/uploads/` pero controller no normalizaba path
**Solución**: 
```javascript
// En guiaController.crear()
const normalizedPath = req.file.path
  .replace(/\\/g, '/')
  .replace(/^backend\//, '')
// Resultado: "uploads/guias/filename.pdf"
```

#### Problema 2: Ejercicio Image 500 Error
**Root Cause**: Multer destination era `uploads/ejercicios/` (no existe) pero carpeta real es `backend/uploads/ejercicios/`
**Solución**: Actualizar destination a ruta completa `backend/uploads/ejercicios/`

---

## Integraciones Externas

### 1. LandBot - Chatbot Paco

**Qué es LandBot**:
- Servicio externo de chatbot.io
- Widget que se embebe en página web
- Conversaciones automáticas y manuales

**Integración en React**:

```jsx
// LandBotWidget.jsx
{isDesktop ? (
  <IframeLandBotContainer token="PUBLIC_TOKEN" />
) : (
  <IframeLandBotChat token="PUBLIC_TOKEN" />
)}
```

**Tracking de Interacciones Paco**:

Problema: Contaba cada page load como nueva interacción

Solución:
```javascript
const registrarInteraccion = () => {
  const ya_registrada = sessionStorage.getItem('paco_interaccion_registrada')
  if (!ya_registrada) {
    // Solo registra UNA VEZ por sesión
    fetch('/api/paco/interaccion', { method: 'POST' })
    sessionStorage.setItem('paco_interaccion_registrada', 'true')
  }
}

// En desktop container:
containerRef.current.addEventListener(
  'click', 
  registrarInteraccion, 
  { once: true }  // Solo dispara una vez
)
```

**Datos Guardados en BD**:
```javascript
// InteraccionPaco (si existe en BD)
{
  _id: ObjectId,
  usuarioId: ObjectId (opcional),
  timestamp: ISODate,
  tipo: "chat_click" | "mensaje_enviado"
}
```

### 2. Email (si está configurado)

**Rutas emailRoutes.js**:
- `POST /api/email/send-welcome` → Email de bienvenida nuevo usuario
- Puede usar Nodemailer + Gmail, SendGrid, etc.

**Implementación**:
```javascript
// emailController
const enviarBienvenida = async (usuarioEmail, usuarioNombre) => {
  // Usar transporter (SMTP)
  // Enviar HTML email
  // Log para tracking
}
```

---

## Optimizaciones y Fixes Realizados

### 1. Iconografía Semántica en Modales (Reciente)

**Problema**: Validaciones mostraban ✓ verde (éxito) pero eran errores

**Solución**:
```javascript
// CustomModal.jsx acepta iconType explícito
{
  type: 'alert',
  message: 'El nombre debe contener...',
  iconType: 'error'  // ← ✗ rojo
}

// En todas modales (Dashboard + AdminDashboard):
// Validaciones → iconType: 'error'
// Success → iconType: 'success'
// Confirmaciones → iconType: 'warning'
```

**Colores Finales**:
- Success: `#39ff14` (neon green)
- Error: `#ff0080` (hot pink/red)
- Warning: `#ffaa00` (orange/yellow)

### 2. Paco Chatbot Tracking

**Problema**: Contador aumentaba cada page load

**Solución**: sessionStorage + click listener (registra solo primera interacción por sesión)

### 3. Gráfico de Porcentajes

**Problema**: Mostraba conteos como porcentajes (5%, 6%, 6%)

**Solución**:
```javascript
// GraficoCircular.jsx
const total = data.reduce((sum, item) => sum + item[dataKey], 0)
const percentage = Math.round((item[dataKey] / total) * 100)

// Resultado: 29%, 33%, 38% (suma = 100%)
```

### 4. Multer Path Normalization

**Problema**: Archivos no se servían correctamente en Windows (backslashes)

**Solución**: Normalizar en controllers
```javascript
const normalized = filePath
  .replace(/\\/g, '/')
  .replace(/^backend\//, '')
```

### 5. Security Audit Fixes

Vulnerabilidades encontradas y parcialmente arregladas:

| Vulnerability | Severidad | Estado |
|---|---|---|
| Exports sin autenticación | CRÍTICA | ✅ Fija |
| Debug endpoint público | CRÍTICA | ✅ Eliminada |
| `/users/:id` sin admin check | ALTA | ✅ Mejora |
| Inconsistencia req.user._id vs id | MEDIA | ✅ Estandarizada |
| File paths en error messages | MEDIA | ✅ Oculta |

---

## Flujos de Datos Completos

### Flujo de Administrador - CRUD Ejercicios

```
AdminDashboard.jsx
│
├─ [1] Cargar lista
│  └─ GET /api/ejercicios → loadEjercicios()
│
├─ [2] Click "Crear Nuevo"
│  ├─ setShowEjercicioModal(true)
│  └─ Mostrar form vacío
│
├─ [3] Llena form
│  ├─ nombre, descripcion, grupoMuscular, dificultad
│  ├─ Input file: usuario selecciona imagen
│  └─ setEjercicioForm({ ...form, imagen: File })
│
├─ [4] Click "Guardar"
│  └─ handleSaveEjercicio()
│
├─ [5] Validación Frontend
│  ├─ Campos obligatorios
│  ├─ Tipo archivo
│  └─ Si error → Modal error (iconType: 'error')
│
├─ [6] Crear FormData (multipart)
│  ├─ Append 'nombre'
│  ├─ Append 'imagen' (File)
│  └─ POST /api/ejercicios
│
├─ [7] BACKEND - Multer
│  ├─ Intercepta request
│  ├─ Guarda archivo: backend/uploads/ejercicios/1708079265921.jpg
│  ├─ req.file = { path, filename, size, ... }
│  └─ Pasa a controller
│
├─ [8] BACKEND - Controller
│  ├─ Normaliza: "backend\uploads\..." → "uploads/ejercicios/..."
│  ├─ Crea documento Ejercicio
│  ├─ Save en BD
│  └─ Retorna: { _id, nombre, imagen: "uploads/ejercicios/...", ... }
│
├─ [9] FRONTEND - Response
│  ├─ 201 Created
│  ├─ Modal: "Ejercicio creado" (iconType: 'success')
│  ├─ setShowEjercicioModal(false)
│  └─ loadEjercicios() (recargar lista)
│
├─ [10] FRONTEND - Mostrar
│  ├─ GET /api/ejercicios
│  ├─ Grid se actualiza
│  ├─ Nuevo ejercicio es visible
│  └─ <img src="/uploads/ejercicios/1708079265921.jpg" />
│
├─ [11] EDITAR ejercicio
│  ├─ Click "Editar" en card
│  ├─ Cargar datos en form
│  ├─ Si selecciona nueva imagen: put /api/ejercicios/:id (con nueva img)
│  ├─ Controller borra foto vieja y guardan nueva
│  └─ Modal success
│
└─ [12] ELIMINAR ejercicio
   ├─ Click "Eliminar"
   ├─ Modal confirm (iconType: 'warning'): "¿Seguro?"
   ├─ Click "Confirmar"
   ├─ DELETE /api/ejercicios/:id
   ├─ Backend: elimina archivo + documento
   ├─ Modal success (iconType: 'success')
   └─ Grid actualiza sin ejercicio
```

### Estadísticas Dashboard Admin

```
AdminDashboard → Tab "Estadísticas"
│
├─ GET /api/stats/usuarios
│  ├─ Contar por objetivo
│  └─ GraficoCircular: "Pérdida peso: 29%, Ganancia: 33%, Mantenimiento: 38%"
│
├─ GET /api/stats/clases
│  ├─ Contar inscripciones por clase
│  └─ GraficoBarras: mostrar clases más populares
│
├─ GET /api/stats/ejercicios
│  ├─ Contar ejercicios por grupo muscular
│  └─ GraficoCircular: "Pecho: 25%, Piernas: 35%, ..."
│
└─ GET /api/stats/paco
   ├─ Contar interacciones chatbot
   └─ GraficoLineal: evolución interacciones por día
```

---

## Mejores Prácticas Implementadas

### Frontend
✅ Context API para estado global (Auth, Accessibility)
✅ Custom Hooks reutilizables
✅ Componentes funcionales con hooks
✅ CSS Variables para theming
✅ Validaciones antes de enviar al backend
✅ Error boundaries (si implementadas)
✅ Modales y notificaciones para feedback usuario
✅ Accesibilidad (skip links, ARIA labels)

### Backend
✅ Middleware pattern (auth, validation, multer)
✅ Separación Controllers/Routes/Models
✅ JWT para autenticación stateless
✅ Bcrypt para hashing passwords
✅ Try/catch y error handling
✅ Validación en entrada + base de datos
✅ Multer normalization for cross-platform paths
✅ Express.static para archivos
✅ CORS configurado

### Seguridad
✅ JWT tokens con expiración
✅ Rutas protegidas con middleware
✅ Admin checks
✅ Input validation
✅ No exposición de info sensible en errores

---

## Posibles Mejoras Futuras

1. **Autenticación**:
   - Refresh tokens (separar short-lived access token + long-lived refresh token)
   - OAuth2 (Google, Facebook login)
   - 2FA (two-factor authentication)

2. **Performance**:
   - Caching (Redis)
   - Compresión imagen ejercicios
   - Lazy loading componentes
   - Pagination en listas largas

3. **Características**:
   - Historial entrenamientos usuario
   - Planes personalizados
   - Notificaciones push
   - Recordatorios clases
   - Reportes estadísticos mensales

4. **Infrastructure**:
   - containerización (Docker)
   - CI/CD (GitHub Actions, etc)
   - Monitoring (Sentry)
   - Logging centralizado

5. **Funcionalidad Chatbot**:
   - Integración custom con backend (en lugar de solo LandBot externo)
   - Recomendaciones basadas en objetivo usuario
   - Q&A automático sobre ejercicios

---

## Resumen Ejecutivo

**UltimateGym** es una aplicación web full-stack que integra:

- **Frontend React moderno** con componentes reutilizables, context API para estado global, y UI responsiva con accesibilidad
- **Backend Express robusto** con autenticación JWT, CRUD operations, validaciones, y file uploads con Multer
- **MongoDB** para persistencia de datos con schemas validados
- **Multer** para gestión de archivos (imágenes ejercicios, PDFs guías)
- **LandBot** para chatbot conversacional integrado
- **Recharts** para visualización de estadísticas

Todos los componentes están **integrados y comunicados** a través de una API RESTful bien estructurada, con **autenticación y autorización**, validaciones en ambos lados, y manejo de errores consistente con **iconografía semántica** (✓ success, ✗ error, ⚠ warning).

El proyecto demuestra **buenas prácticas** en arquitectura de software, separación de concerns, y seguridad básica para una aplicación de producción-ready.

---

**Documento generado**: Febrero 2026
**Versión**: 1.0

