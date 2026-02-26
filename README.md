# UltimateGym

**Autor:** Iván Pons Martínez Link de linkedin: www.linkedin.com/in/iván-pons-martínez-617609183

¡Bienvenido/a a UltimateGym! 🏋️‍♂️

Este es mi proyecto fullstack, Una app de gimnasio moderna, con frontend en React (Vite) y backend Node.js/Express/MongoDB. Si eres recruiter, compañer@ dev o simplemente te gusta, aquí tienes un ejemplo realista y funcional.

---

## 📱 Vista previa

<div align="center">
  <img src="frontend-react/public/expositor_PC.png" alt="Vista PC" width="70%" style="margin: 15px;"/>
  
  <img src="frontend-react/public/expositor_movil.png" alt="Vista Móvil" width="30%" style="margin: 15px;"/>
</div>

---

## ¿Qué es esto?

UltimateGym es una SPA fullstack completa donde puedes:
- Registrarte y loguearte con autenticación JWT y roles (user/admin)
- Ver y apuntarte a clases de gimnasio
- Consultar y filtrar ejercicios por grupo muscular y equipamiento (con imágenes)
- Descargar guías en PDF personalizadas
- Panel de admin completo para gestionar usuarios, clases, ejercicios y guías
- Estadísticas detalladas (usuarios por objetivo, clases populares, inscripciones, análisis por día)
- Exportación de datos de usuarios y clases (preparado para automatizar a Excel con n8n)
- **Envío automático de guías por email** a través de n8n
- Chat en vivo con Landbot
- Accesibilidad real (widgets, skiplinks, contraste, etc.)

Todo con seeds de ejemplo para que lo veas funcionando nada más clonar.

---

## 🎮 Experiencia Visual & Diseño

UltimateGym no es solo funcionalidad, es **una experiencia de usuario completa** diseñada para **motivar y enganchar**:

### ✨ Diseño Cyberpunk Moderno
- **Colores Neón:** Morado y azul fluorescente sobre fondos oscuros para crear contraste visual hipnotizante
- **Animaciones Suaves:** Efectos fadeIn, scale, glow y gradientes que fluyen constantemente
- **Shadowbox Radiante:** Cada elemento brilla con efectos de luz neón que responden al hover
- **Interfaz Responsiva:** Adaptada perfectly a PC, tablet y móvil sin perder la calidad visual

### 💪 Gamificación & Motivación
La app está diseñada para que el usuario **quiera volver**:
- **Dashboard inspirador:** Estadísticas visuales con gráficas dinámicas que muestran tu progreso
- **Interfaz intuitiva:** Flujos claros y rápidos para apuntarse a clases
- **Feedback visual:** Cada acción tiene una respuesta inmediata (animaciones, notificaciones)
- **Accesibilidad total:** Widgets de accesibilidad, contraste mejorado, navegación por teclado - porque entrenar incluye a todos

### 🎯 Propósito
UltimateGym existe para una sola cosa: **Hacerte querer entrenar 💪**

---

♿ Accesibilidad: Pensando en Todos

UltimateGym incluye características de accesibilidad reales:

- **Widget de Accesibilidad:** Botón en esquina inferior derecha para activar modo accesible con alto contraste
- **Skip Link:** Salta directamente al contenido principal (visible cuando el modo accesible está activado)
- **Etiquetas ARIA:** Labels descriptivos en navegación, botones y componentes clave
- **Alto Contraste:** Estilos específicos blanco sobre fondos oscuros para máxima legibilidad
- **Focus Visible:** Todos los elementos interactivos tienen foco visible en navegación por teclado
- **Respeta Preferencias del Sistema:** Detecta `prefers-color-scheme` del navegador
- **Responsive:** Funciona perfectamente en todos los tamaños de pantalla

Queremos que entrenar sea accesible para todos. 💪

---

## Tecnologías y stack

- **Frontend:** React 19, Vite, CSS Modules, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose), Multer
- **Auth:** JWT, roles, bcryptjs
- **Otros:** Landbot, n8n (webhook para emails), variables de entorno, seeds automáticos

---

## ¿Cómo lo pruebas?

1. Clona el repo y entra en la carpeta
2. Copia `.env.example` a `.env` y pon tus datos (o deja los de local para probar)
3. Instala dependencias:
   - npm install

4. Ejecuta los seeds para tener datos de ejemplo:
   
   - node backend/seeds/index.js
5. Arranca todo (backend y frontend a la vez):
   ```
   npm run dev:all
   ```
6. Abre [http://localhost:3000](http://localhost:3000) y explora la app


---

## Configuración opcional

Estas características están implementadas en el proyecto y funcionan si las configuras:

- **n8n (automatizaciones):** Conecta tu instancia de n8n para activar automáticamente:
  - Envío de emails con guías personalizadas a usuarios
  - Exportación automática de datos a hojas Excel
  - Otros flujos de automatización que diseñes
  
  Configura `N8N_WEBHOOK_URL` en tu `.env` con tu webhook de n8n. Sin esta configuración, el proyecto funciona normalmente pero sin las automatizaciones.
  
  **Ejemplos de flujos de n8n implementados:**
  
  *Automatización de envío de guías por email:*
  ![Flujo n8n Gmail](frontend-react/public/n8n%20Gmail.png)
  
  *Exportación automática de datos a Excel:*
  ![Flujo n8n Excel](frontend-react/public/n8n_excel.png)
  
  *Se conoce que lo que se ha realizado con n8n se podría hacer de otras formas en código directamente pero se quería probar n8n en este proyecto para aprender formas diferentes de hacerlo*

  **Si quieres probar a hacerlo en código puedes utilizar las librerías nodemailer, exceljs etc.**



- **Landbot (chat en vivo):** El ChatBot funcionará correctamente porque está el link del landbot siempre en escucha. Si quieres insertar otro modifica el enlace del LandBot.

---

## Cosas interesantes del código

- Estructura clara: **MVC en backend**, componentes y contextos en frontend
- Seeds con imágenes de ejemplo (¡no más apps vacías al clonar!)
- **Autenticación JWT con roles** (user/admin) y validaciones completas
- **Sistema de automatizaciones** integrado con n8n para envíos de emails y exportaciones
- **Estadísticas avanzadas** con agregaciones MongoDB en tiempo real
- **Filtros y búsquedas bidireccionales** (frontend y backend)
- **Panel admin real** con gestión completa de usuarios, clases, ejercicios y guías
- **Gráficas interactivas** con Recharts (lineal, circular, de barras)
- **Gestión de archivos** (PDF y imágenes) con multer y almacenamiento en servidor
- **Accesibilidad de verdad**, no solo por cumplir (WCAG compliance)
- Código comentado y limpio, sin relleno ni funciones muertas
- Variables de entorno bien documentadas

---


Cualquier cosa que necesites, sugerencias o demás, no dudes en contactarme por Linkedin 😉