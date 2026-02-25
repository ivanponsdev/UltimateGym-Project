# RUTA DE PRUEBAS - Exposición TFG UltimateGym

## Guía paso a paso para demostrar TODAS las funcionalidades de la aplicación

---

## 🟢 PREPARACIÓN ANTES DE LA EXPOSICIÓN

### Paso 0: Arrancar la aplicación

1. Abre una terminal en la carpeta raíz del proyecto
2. Ejecuta:
   ```
   npm run dev:all
   ```
3. Espera a ver en consola:
   - `Servidor Fase 1 iniciado en http://localhost:5001` (backend)
   - `Local: http://localhost:3000/` (frontend Vite)
4. Abre el navegador en `http://localhost:3000`

### Datos de prueba que necesitas tener:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | *(el que tengas en el seed)* | *(el que tengas)* |
| Usuario normal | Se creará durante la demo | Se creará durante la demo |

### Abre dos cosas antes de empezar:

- **Pestaña 1**: La app en `http://localhost:3000`
- **Pestaña 2**: Las DevTools del navegador (F12 → pestaña Network) para mostrar peticiones HTTP en tiempo real

---

## BLOQUE 1: PÁGINAS PÚBLICAS (sin login)

> **Objetivo**: Demostrar que hay contenido accesible sin autenticación y que la navegación básica funciona.

---

### Prueba 1.1 — Landing Page

**Qué hacer:**
1. Abre `http://localhost:3000`
2. Verás la página de bienvenida con el logo "ULTIMATE GYM"

**Qué enseñar:**
- El logo flotante en la esquina
- Los dos botones: "Comenzar" y "Información"
- El diseño responsive: reescala la ventana del navegador para mostrar cómo se adapta

**Qué decir:**
> "Esta es la landing page pública. Cualquier visitante la ve sin necesidad de autenticarse. Desde aquí puede ir a registrarse o ver información del gimnasio."

---

### Prueba 1.2 — Página de Información

**Qué hacer:**
1. Pulsa el botón **"Información"**
2. Se abre la página con la ubicación y los horarios del gimnasio

**Qué enseñar:**
- La tabla de horarios
- El botón "← Volver" que te devuelve a la Landing
- Que esta página es pública y accesible sin login

**Qué decir:**
> "La página de información muestra datos del gimnasio como ubicación y horarios. Es accesible sin autenticación."

---

### Prueba 1.3 — Accesibilidad

**Qué hacer:**
1. En cualquier página, localiza el **botón circular** en la esquina inferior derecha (icono de persona)
2. Pasa el ratón por encima → aparece tooltip "Activar modo accesible"
3. Haz clic → la interfaz cambia a modo de alto contraste

**Qué enseñar:**
- El tooltip que aparece al hover
- Cómo cambia toda la interfaz (colores de alto contraste)
- Que el atributo `aria-pressed` cambia de `false` a `true`
- Que detecta automáticamente las preferencias del sistema (`prefers-contrast`)
- Pulsa otra vez para desactivar

**Qué decir:**
> "La aplicación incluye un widget de accesibilidad que permite activar un modo de alto contraste. Esto se implementó con un Context de React y CSS condicional. Además, detecta automáticamente si el sistema operativo del usuario tiene activado el modo de alto contraste."

---

### Prueba 1.4 — Footer

**Qué hacer:**
1. Baja hasta el final de cualquier página

**Qué enseñar:**
- El footer con información del proyecto
- Que aparece en todas las páginas (componente global en App.jsx)

---

## BLOQUE 2: REGISTRO Y AUTENTICACIÓN

> **Objetivo**: Demostrar el sistema de registro con validaciones, login, JWT y protección de rutas.

---

### Prueba 2.1 — Pantalla de Login/Registro

**Qué hacer:**
1. Desde la Landing, pulsa **"Comenzar"**
2. Aparece la pantalla de autenticación con toggle Login/Registro

**Qué enseñar:**
- El formulario tiene dos modos (Login y Registro)
- El logo flotante también aparece aquí

---

### Prueba 2.2 — Validaciones de Registro (ERRORES INTENCIONADOS)

> **IMPORTANTE**: Aquí demuestras que las validaciones funcionan. Hazlo despacio.

**Qué hacer (paso a paso):**

1. **Cambia a modo Registro** (pulsa "¿No tienes cuenta? Regístrate")

2. **Nombre inválido** → Escribe solo "Juan" (una palabra)
   - **Resultado esperado**: Aparece error en tiempo real debajo del campo: *"El nombre debe contener al menos nombre y apellido (mínimo 2 palabras)"*
   - **Qué decir**: "La validación en tiempo real detecta que el nombre necesita nombre y apellido"

3. **Email inválido** → Escribe "juangmail.com" (sin @)
   - **Resultado esperado**: Error: *"El formato del email no es válido"*
   - **Qué decir**: "Se valida el formato del email con regex tanto en frontend como en backend"

4. **Contraseña débil** → Escribe "1234"
   - **Resultado esperado**: Error: *"Al menos 8 caracteres, una mayúscula, una minúscula y un número"*
   - **Qué decir**: "La contraseña debe cumplir requisitos de seguridad: mínimo 8 caracteres, mayúscula, minúscula y número"

5. **Contraseñas no coinciden** → Escribe "Password1" y confirma con "Password2"
   - **Resultado esperado**: Error: *"Las contraseñas no coinciden"*

**Qué decir al final:**
> "Todas estas validaciones se hacen en TIEMPO REAL conforme el usuario escribe, no solo al enviar el formulario. Están implementadas con regex en el frontend y también se validan en el backend como segunda capa de seguridad."

---

### Prueba 2.3 — Registro Exitoso

**Qué hacer:**
1. Rellena el formulario correctamente:
   - Nombre: **"Juan Pérez García"**
   - Email: **"juan.perez@ejemplo.com"**
   - Contraseña: **"Password1"**
   - Confirmar: **"Password1"**
2. Pulsa "Registrarse"

**Resultado esperado:**
- Aparece notificación toast verde ✓: *"¡Cuenta creada con éxito!"*
- Se redirige automáticamente al Dashboard del usuario tras 1 segundo

**Qué enseñar** (abre DevTools → Network):
- La petición POST a `/api/auth/register`
- La respuesta contiene un token JWT y los datos del usuario
- El token se guarda en `localStorage` (mostrar en DevTools → Application → Local Storage)

**Qué decir:**
> "Al registrarse, el backend crea el usuario en MongoDB, hashea la contraseña con bcrypt y devuelve un token JWT que se guarda en localStorage para mantener la sesión."

---

### Prueba 2.4 — Cerrar sesión y Login

**Qué hacer:**
1. Desde el Dashboard, busca el botón de **cerrar sesión** en el Sidebar
2. Pulsa → te redirige a la Landing
3. Ve a "Comenzar" → Login
4. Introduce el email y contraseña que acabas de registrar
5. Pulsa "Iniciar sesión"

**Resultado esperado:**
- Notificación verde ✓: *"¡Bienvenido de nuevo!"*
- Redirige al Dashboard

**Qué decir:**
> "Al cerrar sesión se borra el token del localStorage. Al volver a iniciar sesión, el backend verifica las credenciales con bcrypt.compare y genera un nuevo JWT."

---

### Prueba 2.5 — Intentar acceder a ruta protegida sin login

**Qué hacer:**
1. **Cierra sesión** primero
2. Escribe directamente en la barra del navegador: `http://localhost:3000/dashboard`
3. Pulsa Enter

**Resultado esperado:**
- Te redirige automáticamente a `/auth` (pantalla de login)
- **NO** puedes ver el dashboard

**Qué hacer después:**
4. Ahora prueba con: `http://localhost:3000/admin`
5. Pulsa Enter

**Resultado esperado:**
- También te redirige a `/auth`

**Qué decir:**
> "Las rutas están protegidas con un componente ProtectedRoute que verifica si hay usuario autenticado en el Context de React. Si no hay token, redirige al login. Además, la ruta /admin comprueba que el rol sea 'admin'. "

---

### Prueba 2.6 — Intentar acceder al API directamente sin token

**Qué hacer** (en la barra de navegador o desde consola DevTools):

1. Abre una nueva pestaña y escribe: `http://localhost:5001/api/users`
2. Pulsa Enter

**Resultado esperado:**
```json
{"message": "No token provided"}
```

3. Ahora prueba: `http://localhost:5001/api/clases`

**Resultado esperado:**
```json
{"message": "No token provided"}
```

4. Ahora prueba: `http://localhost:5001/api/export/users`

**Resultado esperado:**
```json
{"message": "No token provided"}
```

**Qué decir:**
> "El backend también está protegido con middleware JWT. Aunque alguien intente acceder directamente a la API REST sin pasar por el frontend, recibe un 401 Unauthorized. Cada endpoint verifica el token JWT del header Authorization."

---

### Prueba 2.7 — Intentar acceder al panel admin siendo usuario normal

**Qué hacer:**
1. Inicia sesión con el usuario **"Juan Pérez García"** (el que creaste, que es rol `user`)
2. Escribe en la barra: `http://localhost:3000/admin`

**Resultado esperado:**
- Te redirige a `/dashboard` (el ProtectedRoute detecta que no eres admin)

**Qué decir:**
> "Incluso estando autenticado, si no tienes rol de admin, no puedes acceder al panel de administración. El componente ProtectedRoute comprueba el rol del usuario."

---

## BLOQUE 3: DASHBOARD DE USUARIO

> **Objetivo**: Demostrar todas las funcionalidades del usuario normal.

---

### Prueba 3.1 — Ver Dashboard

**Qué hacer:**
1. Inicia sesión como usuario normal ("Juan Pérez García")
2. Observa el Dashboard

**Qué enseñar:**
- El **Sidebar** lateral con los apartados de navegación
- Las secciones: Perfil, Clases, Ejercicios, Guías, Chatbot Paco
- Que los datos del perfil se cargan automáticamente

---

### Prueba 3.2 — Editar Perfil

**Qué hacer:**
1. Ve a la sección de **Perfil**
2. Modifica la edad (por ejemplo, pon 25)
3. Selecciona un sexo
4. Selecciona un objetivo (ej: "Aumento de masa muscular")
5. Pulsa "Guardar cambios"

**Resultado esperado:**
- Modal con ✓ verde: *"Perfil actualizado correctamente"*

6. **Ahora prueba validaciones de error**: Borra el nombre y deja solo una palabra
7. Pulsa Guardar

**Resultado esperado:**
- Modal con ✗ rojo: *"El nombre debe contener al menos nombre y apellido"*

**Qué decir:**
> "El perfil se actualiza con una petición PUT al backend. Las validaciones muestran un icono semántico: ✓ verde para éxito, ✗ rojo para errores, ⚠ amarillo para confirmaciones. Esto lo implementé con un prop iconType en el componente CustomModal."

---

### Prueba 3.3 — Ver Clases Disponibles

**Qué hacer:**
1. Ve a la sección **"Clases"**
2. Se muestra el listado de clases disponibles

**Qué enseñar:**
- Las cards de cada clase con: nombre, día, hora, profesor, cupo
- Que se ve quién es el profesor y cuántas plazas quedan

---

### Prueba 3.4 — Inscribirse en una Clase

**Qué hacer:**
1. Busca una clase con plazas disponibles
2. Pulsa el botón **"Inscribirse"**

**Resultado esperado:**
- Modal con ✓ verde: *"Te has inscrito correctamente"*
- La clase ahora aparece en tu sección de "Mis clases"
- El contador de plazas se actualiza

**Qué enseñar** (DevTools → Network):
- Petición POST a `/api/clases/:id/inscribir`
- Respuesta 200 OK

**Qué decir:**
> "La inscripción hace un POST al backend, que añade el usuario al array de alumnos de la clase y actualiza el cupo. Se valida que haya plazas disponibles."

---

### Prueba 3.5 — Desinscribirse de una Clase

**Qué hacer:**
1. En "Mis clases", busca la clase donde te inscribiste
2. Pulsa **"Desinscribirse"**

**Resultado esperado:**
- Modal con ⚠ amarillo: *"¿Seguro que quieres desinscribirte?"* con botones Cancelar/Confirmar
- Pulsa **"Confirmar"**
- Modal con ✓ verde: *"Te has desinscrito correctamente"*

**Qué decir:**
> "Las acciones destructivas como desinscribirse o eliminar siempre piden confirmación con un modal de tipo 'confirm' y icono ⚠ amarillo, para que el usuario no borre datos por accidente."

---

### Prueba 3.6 — Ver Ejercicios

**Qué hacer:**
1. Ve a la sección **"Ejercicios"**
2. Se muestra un grid de cards con los ejercicios

**Qué enseñar:**
- La imagen técnica de cada ejercicio (cargada desde el servidor)
- Nombre, grupo muscular, dificultad
- Las instrucciones del ejercicio

**Qué decir:**
> "Los ejercicios se muestran en cards. Las imágenes se sirven desde el backend con Express.static desde la carpeta uploads/ejercicios. Cada ejercicio tiene grupo muscular, dificultad e instrucciones."

---

### Prueba 3.7 — Ver Guías PDF

**Qué hacer:**
1. Ve a la sección **"Guías"**
2. Se muestran las guías disponibles (filtradas por tu objetivo)

**Qué enseñar:**
- Que solo ves las guías correspondientes a tu objetivo (el que configuraste en el perfil)
- El botón de descarga del PDF
- Pulsa descargar → se descarga o abre el PDF

**Qué decir:**
> "Las guías se filtran automáticamente según el objetivo del usuario. El filtrado se hace en el backend con MongoDB: busca guías cuyo objetivo coincida con el del usuario o sean de tipo 'todos'. Los PDFs se almacenan en el servidor y se sirven con Express.static."

---

### Prueba 3.8 — Chatbot Paco

**Qué hacer:**
1. Ve a la sección **"Paco"** (asistente virtual)
2. **En escritorio**: Aparece el widget de LandBot integrado directamente
3. Haz clic en el chat o envía un mensaje
4. **En móvil** (si lo muestras): Aparece un botón para abrir el chat

**Qué enseñar:**
- El chatbot está integrado con LandBot
- La respuesta automática del bot

**Qué decir:**
> "El asistente virtual Paco está integrado con la plataforma LandBot. En escritorio se muestra como un widget embebido, en móvil como un chat emergente. La primera interacción del usuario en cada sesión se registra en la base de datos para las estadísticas del admin, usando sessionStorage para evitar conteos duplicados."

---

## BLOQUE 4: PANEL DE ADMINISTRADOR

> **Objetivo**: Demostrar TODAS las operaciones CRUD del admin y las estadísticas.

---

### Prueba 4.1 — Login como Admin

**Qué hacer:**
1. Cierra sesión del usuario normal
2. Inicia sesión con las credenciales de **admin**
3. Se redirige automáticamente a `/admin`

**Qué enseñar:**
- La redirección automática según rol: `data.usuario.role === 'admin' ? '/admin' : '/dashboard'`

---

### Prueba 4.2 — Dashboard de Estadísticas

**Qué hacer:**
1. Ya en el AdminDashboard, ve a la sección de **Estadísticas**

**Qué enseñar:**
- **Gráfico circular** de usuarios por objetivo (porcentajes reales calculados)
- **Gráfico de barras** de clases por día
- **Gráfico circular** de usuarios por sexo
- **Gráfico lineal** de evolución temporal
- Contadores: total usuarios, total clases, total inscripciones
- Clases más populares

**Qué decir:**
> "Las estadísticas se calculan en el backend con agregaciones MongoDB. Los gráficos se renderizan con la librería Recharts. Los porcentajes del gráfico circular se calculan dividiendo cada valor por el total y multiplicando por 100, mostrando porcentajes reales en lugar de conteos."

---

### Prueba 4.3 — CRUD de Usuarios

**4.3.1 — Ver listado de usuarios:**
1. Ve a la sección **"Usuarios"**
2. Se muestra la tabla con todos los usuarios del sistema

**4.3.2 — Crear usuario nuevo:**
1. Pulsa **"Crear usuario"**
2. Rellena el formulario:
   - Nombre: "María López García"
   - Email: "maria@test.com"
   - Password: "Password1"
   - Rol: user
3. Pulsa Guardar

**Resultado esperado:**
- Modal ✓ verde: *"Usuario creado correctamente"*
- El usuario aparece en la tabla

**4.3.3 — Editar usuario:**
1. Busca un usuario y pulsa **"Editar"**
2. Cambia el nombre o el rol
3. Pulsa Guardar

**Resultado esperado:**
- Modal ✓ verde: *"Usuario actualizado correctamente"*

**4.3.4 — Intentar crear usuario con datos inválidos:**
1. Pulsa "Crear usuario" otra vez
2. Pon un nombre de una sola palabra → Guardar

**Resultado esperado:**
- Modal ✗ rojo: *"El nombre debe contener al menos nombre y apellido"*

**4.3.5 — Eliminar usuario:**
1. Busca un usuario y pulsa **"Eliminar"**

**Resultado esperado:**
- Modal ⚠ amarillo: *"¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer."*
- Pulsa "Confirmar"
- Modal ✓ verde: *"Usuario eliminado correctamente"*
- El usuario desaparece de la tabla

**Qué decir:**
> "El CRUD de usuarios está completamente implementado. Las operaciones de creación y edición tienen las mismas validaciones que el registro. La eliminación siempre pide confirmación. Todo protegido: solo el admin puede acceder a estas funciones."

---

### Prueba 4.4 — CRUD de Clases

**4.4.1 — Crear clase nueva:**
1. Ve a la sección **"Clases"**
2. Pulsa **"Crear clase"**
3. Rellena:
   - Nombre: "Yoga matutino"
   - Día: Martes
   - Hora inicio: 08:00
   - Hora fin: 09:00
   - Profesor: "Ana Martínez"
   - Cupo máximo: 15
4. Guardar

**Resultado esperado:**
- Modal ✓ verde: *"Clase creada correctamente"*

**4.4.2 — Editar clase:**
1. Busca la clase y pulsa "Editar"
2. Cambia el cupo a 20
3. Guardar → ✓ verde

**4.4.3 — Eliminar clase:**
1. Pulsa "Eliminar" en la clase
2. Confirma → ✓ verde → clase eliminada

---

### Prueba 4.5 — CRUD de Ejercicios (con subida de imagen)

> **IMPORTANTE**: Aquí demuestras la subida de archivos con Multer.

**4.5.1 — Crear ejercicio con imagen:**
1. Ve a la sección **"Ejercicios"**
2. Pulsa **"Crear ejercicio"**
3. Rellena:
   - Nombre: "Press de banca"
   - Grupo muscular: "Pecho"
   - Dificultad: "Intermedio"
   - Instrucciones: "Tumbarse en banco, agarrar la barra..."
4. **Selecciona una imagen** (archivo JPG o PNG de tu ordenador)
5. Guardar

**Resultado esperado:**
- Modal ✓ verde: *"Ejercicio creado correctamente"*
- El ejercicio aparece en la lista con la imagen cargada

**Qué enseñar** (DevTools → Network):
- La petición POST es `multipart/form-data` (no JSON)
- El body incluye el archivo binario
- La respuesta incluye la ruta de la imagen guardada

**Qué decir:**
> "La subida de imágenes se gestiona con Multer, un middleware de Express. El archivo se valida: solo se permiten imágenes (jpeg, jpg, png, gif, webp) y máximo 5MB. La imagen se guarda en el servidor en la carpeta uploads/ejercicios con un nombre único basado en timestamp para evitar colisiones. La ruta se normaliza para funcionar tanto en Windows como en Linux."

**4.5.2 — Intentar subir un archivo no válido (OPCIONAL pero impresiona):**
1. Crea un ejercicio e intenta subir un archivo `.exe` o `.txt`
2. Resultado: Error porque Multer rechaza el tipo de archivo

---

### Prueba 4.6 — CRUD de Guías (con subida de PDF)

**4.6.1 — Crear guía nueva:**
1. Ve a la sección **"Guías"**
2. Pulsa **"Crear guía"**
3. Rellena:
   - Nombre: "Guía de principiante"
   - Descripción: "Guía completa para empezar en el gimnasio"
   - Objetivo: "Aumento de masa muscular" (o "todos")
4. **Selecciona un archivo PDF** de tu ordenador
5. Guardar

**Resultado esperado:**
- Modal ✓ verde: *"Guía creada correctamente"*

**Qué decir:**
> "Las guías funcionan igual que los ejercicios pero con PDFs. Multer valida que el tipo MIME sea application/pdf y que la extensión sea .pdf. Máximo 10MB. Cada guía tiene un objetivo asociado, y los usuarios solo ven las guías de su objetivo."

**4.6.2 — Verificar que un usuario normal ve la guía:**
1. Abre otra pestaña/ventana de incógnito
2. Inicia sesión como el usuario "Juan Pérez García"
3. Ve a Guías
4. Comprueba que la guía aparece (si el objetivo coincide)
5. Pulsa descargar → se descarga el PDF correctamente

---

## BLOQUE 5: SEGURIDAD Y PROTECCIÓN

> **Objetivo**: Demostrar que la aplicación es segura contra ataques básicos.

---

### Prueba 5.1 — Manipulación de Token JWT

**Qué hacer:**
1. Inicia sesión como usuario normal
2. Abre DevTools → Application → Local Storage → localhost:3000
3. Copia el valor del `token`
4. Modifica una letra cualquiera del token (para corromperlo)
5. Recarga la página
6. Intenta hacer cualquier acción (ej: inscribirse en clase)

**Resultado esperado:**
- Error 401: "Token inválido o expirado"
- La app te redirige al login

**Qué decir:**
> "El JWT se verifica en cada petición con la clave secreta del servidor. Si alguien modifica el token, la firma no coincide y el backend rechaza la petición."

---

### Prueba 5.2 — Intentar operaciones de admin con token de usuario

**Qué hacer (desde la consola del navegador):**

1. Inicia sesión como usuario normal
2. Abre la consola del navegador (F12 → Console)
3. Ejecuta esto:

```javascript
// Intentar obtener todos los usuarios (operación de admin)
fetch('/api/users', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(d => console.log(d))
```

**Resultado esperado:**
```json
{"message": "Acceso denegado: admin requerido"}
```

4. Ahora prueba eliminar un usuario:
```javascript
fetch('/api/users/123456789', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(d => console.log(d))
```

**Resultado esperado:**
```json
{"message": "Acceso denegado: admin requerido"}
```

5. Intentar exportar datos:
```javascript
fetch('/api/export/users', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(d => console.log(d))
```

**Resultado esperado:**
```json
{"message": "Acceso denegado: admin requerido"}
```

**Qué decir:**
> "Aunque un usuario tenga un token válido, el middleware requireAdmin comprueba que el rol sea 'admin'. Si no lo es, devuelve 403 Forbidden. Esto protege todas las operaciones administrativas: gestión de usuarios, creación de contenido y exportación de datos."

---

### Prueba 5.3 — API sin autenticación

**Qué hacer (desde la consola del navegador, estando logueado o no):**

```javascript
// Sin token, intentar acceder a rutas protegidas
fetch('/api/clases').then(r => r.json()).then(d => console.log(d))
```

**Resultado esperado:**
```json
{"message": "No token provided"}
```

```javascript
// Sin token, intentar crear una clase
fetch('/api/clases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Clase Pirata', diaSemana: 'lunes' })
}).then(r => r.json()).then(d => console.log(d))
```

**Resultado esperado:**
```json
{"message": "No token provided"}
```

**Qué decir:**
> "Cada ruta del backend pasa por el middleware authenticateJWT. Este extrae el token del header Authorization, lo verifica con jwt.verify, y si no es válido devuelve 401. Así la API REST está protegida independientemente del frontend."

---

### Prueba 5.4 — Validación de archivos (seguridad en uploads)

**Qué hacer (desde consola del navegador, logueado como admin):**

```javascript
// Intentar subir un archivo ejecutable como si fuera un PDF
const formData = new FormData()
formData.append('nombre', 'Guia maliciosa')
formData.append('descripcion', 'Test de seguridad')
formData.append('objetivo', 'todos')

// Crear un blob simulando un .exe
const blob = new Blob(['MZ...fake exe content'], { type: 'application/x-msdownload' })
formData.append('archivoPdf', blob, 'virus.exe')

fetch('/api/guias', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
  body: formData
}).then(r => r.text()).then(d => console.log(d))
```

**Resultado esperado:**
- Error: "Solo se permiten archivos PDF"

**Qué decir:**
> "Multer valida tanto la extensión del archivo como su tipo MIME. No basta con renombrar un archivo a .pdf, el tipo MIME también debe ser 'application/pdf'. Esto previene que se suban archivos potencialmente peligrosos al servidor."

---

### Prueba 5.5 — Ruta inexistente en la API

**Qué hacer:**
1. En la barra del navegador: `http://localhost:5001/api/rutaquenoexiste`

**Resultado esperado:**
```json
{"message": "Endpoint de API no encontrado"}
```

**Qué decir:**
> "Las rutas no definidas devuelven un 404 controlado en formato JSON, no un HTML de error genérico. Esto evita revelar información del servidor."

---

## BLOQUE 6: FUNCIONALIDADES TRANSVERSALES

> **Objetivo**: Demostrar detalles técnicos que dan calidad al proyecto.

---

### Prueba 6.1 — Iconografía Semántica de Modales

**Qué decir (mostrando ejemplos ya demostrados):**
> "He implementado un sistema de iconos semánticos en todas las notificaciones:
> - ✓ Verde para acciones exitosas (crear, editar, inscribirse)
> - ✗ Rojo para errores y validaciones fallidas
> - ⚠ Amarillo para confirmaciones de acciones destructivas (eliminar, desinscribirse)
>
> Esto se controla con un prop `iconType` en el componente CustomModal que se pasa explícitamente desde cada llamada."

---

### Prueba 6.2 — Responsive Design

**Qué hacer:**
1. Con la app abierta, pulsa F12 → botón de móvil en DevTools (Toggle Device Toolbar)
2. Selecciona un dispositivo como "iPhone 14" o "Samsung Galaxy"
3. Navega por la app

**Qué enseñar:**
- El sidebar se adapta o se convierte en menú hamburguesa
- Las cards se reorganizan en una columna
- El chatbot cambia de widget embebido a botón de chat
- La landing se adapta al ancho

---

### Prueba 6.3 — Persistencia de Sesión

**Qué hacer:**
1. Inicia sesión como cualquier usuario
2. Cierra la pestaña del navegador (NO cierres sesión)
3. Abre una pestaña nueva → ve a `http://localhost:3000/dashboard`

**Resultado esperado:**
- Sigues autenticado, el Dashboard carga con tus datos

**Qué decir:**
> "La sesión persiste porque el token JWT y los datos del usuario se guardan en localStorage. Al cargar la app, el AuthContext lee estos datos y restaura la sesión."

---

### Prueba 6.4 — Accesibilidad con teclado (SkipLink)

**Qué hacer:**
1. Ve a cualquier página
2. Pulsa la tecla **Tab** una vez

**Resultado esperado:**
- Aparece un enlace "Ir al contenido principal" (SkipLink)

**Qué decir:**
> "Se ha implementado un SkipLink para accesibilidad. Permite a usuarios de lectores de pantalla o navegación con teclado saltar directamente al contenido principal sin tener que pasar por todo el menú."

---

## BLOQUE 7: ARQUITECTURA TÉCNICA (explicación verbal)

> **Objetivo**: Explicar la arquitectura mientras muestras código o el diagrama.

### Puntos clave para explicar:

1. **Arquitectura cliente-servidor**: Frontend React (Vite, puerto 3000) + Backend Express (puerto 5001) + MongoDB

2. **Patrón MVC en backend**: Models (Mongoose schemas) → Controllers (lógica) → Routes (endpoints)

3. **Context API en frontend**: AuthContext para autenticación global, AccessibilityContext para accesibilidad

4. **JWT stateless**: No se guarda sesión en el servidor, todo va en el token

5. **Multer para uploads**: Middleware que intercepta multipart/form-data, valida tipo y tamaño, guarda en disco

6. **Normalización de paths**: Windows usa `\`, Linux usa `/`. Se normaliza en los controllers para que funcione en ambos

7. **Seeds**: Datos iniciales para pruebas en `backend/seeds/`

---

## RESUMEN - ORDEN DE LA RUTA DE PRUEBAS

```
TIEMPO ESTIMADO: 20-25 minutos

 BLOQUE 1 (2 min) — Páginas públicas
   1.1 Landing
   1.2 Info
   1.3 Accesibilidad
   1.4 Footer

 BLOQUE 2 (5 min) — Registro y Auth
   2.1 Pantalla Auth
   2.2 Validaciones de error
   2.3 Registro exitoso
   2.4 Logout + Login
   2.5 Ruta protegida sin login
   2.6 API sin token
   2.7 Admin route sin ser admin

 BLOQUE 3 (5 min) — Dashboard Usuario
   3.1 Ver Dashboard
   3.2 Editar perfil
   3.3 Ver clases
   3.4 Inscribirse
   3.5 Desinscribirse
   3.6 Ejercicios
   3.7 Guías PDF
   3.8 Chatbot Paco

 BLOQUE 4 (5 min) — Panel Admin
   4.1 Login admin
   4.2 Estadísticas
   4.3 CRUD Usuarios
   4.4 CRUD Clases
   4.5 CRUD Ejercicios + imagen
   4.6 CRUD Guías + PDF

 BLOQUE 5 (3 min) — Seguridad
   5.1 Token manipulado
   5.2 User intenta ser admin
   5.3 API sin auth
   5.4 Upload archivo malo
   5.5 Ruta inexistente

 BLOQUE 6 (2 min) — Transversales
   6.1 Iconos semánticos
   6.2 Responsive
   6.3 Persistencia sesión
   6.4 Skip Link

 BLOQUE 7 (3 min) — Arquitectura verbal
```

---

## CHECKLIST FINAL PRE-EXPOSICIÓN

- [ ] MongoDB arrancado y con datos seed
- [ ] `npm run dev:all` funciona sin errores
- [ ] Hay al menos 1 admin y 1 usuario en la BD
- [ ] Hay clases, ejercicios y guías creadas
- [ ] Hay imágenes en `backend/uploads/ejercicios/`
- [ ] Hay PDFs en `backend/uploads/guias/`
- [ ] Tener preparado un JPG y un PDF para subir en vivo
- [ ] Tener preparado un archivo .exe o .txt para demostrar el rechazo de Multer
- [ ] DevTools abiertas en pestaña Network
- [ ] El documento ANALISIS_ARQUITECTURA.md abierto por si preguntan detalles

---

**Documento generado**: Febrero 2026
