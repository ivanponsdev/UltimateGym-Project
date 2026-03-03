# UltimateGym

**Autor:** Iván Pons Martínez | [LinkedIn](https://www.linkedin.com/in/iván-pons-martínez-617609183)

> Una app de gimnasio fullstack moderna. Ejemplo realista y funcional con autenticación, estadísticas, gestión completa y automatizaciones. 💪

---

## 🚀 Demo en Vivo

**[👉 Prueba la demo aquí](https://ultimate-gym-project.vercel.app)** ✨

### Acceso Demo

**Cuenta Usuario Demo:**
```
Email: demo@portfolio.com
Password: Demo123!
```

**Cuenta Admin Demo (Solo Lectura):**
```
Email: admin@portfolio.com
Password: Admin123!
```

⚠️ **Nota importante:** Las cuentas demo tienen **funcionalidades limitadas** para proteger los datos.
- La cuenta usuario no puede editar perfil ni eliminar la cuenta.
- La cuenta admin puede ver **todo el panel de administración** pero no modificar datos (solo lectura).

Para **acceso completo** sin restricciones, sigue las instrucciones de setup local más abajo 👇

---

## 🛠️ Stack Tecnológico

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7-13AA52?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens)
![Deployed](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-blue)

---

## ✨ Features Principales

- ✅ **Autenticación JWT** con roles (user/admin) y bcryptjs
- ✅ **Registro y login** con validaciones completas
- ✅ **Modo demo** para portfolio (acceso limitado)
- ✅ **Clases de gimnasio** - Ver, filtrar, inscribirse/desinscribirse
- ✅ **Biblioteca de ejercicios** - Por grupo muscular, equipamiento, con imágenes
- ✅ **Guías en PDF personalizadas** - Descargables según objetivo
- ✅ **Panel Admin completo:**
  - Gestión de usuarios (CRUD, roles)
  - Gestión de clases (horarios, cupos)
  - Gestión de ejercicios (categorías, imágenes)
  - Gestión de guías (PDF)
- ✅ **Estadísticas avanzadas** - Gráficas en tiempo real (Recharts)
  - Usuarios por objetivo
  - Clases más populares
  - Inscripciones por día
  - Horas con más demanda
- ✅ **Exportación de datos** - Preparado para Excel con n8n
- ✅ **Envío automático de guías por email** vía n8n
- ✅ **Accesibilidad real:**
  - Widget de accesibilidad (contraste, tamaño)
  - Skip links
  - ARIA labels
  - Navegación por teclado
  - Respeta `prefers-color-scheme`
- ✅ **Diseño Cyberpunk moderno** - Neón, animaciones, responsive
- ✅ **Seeds de ejemplo** - Datos precargados al iniciar
- ✅ **Deployed y vivo** - Vercel (frontend) + Render (backend)

---

## 📱 Capturas & Diseño

<div align="center">
  <img src="frontend-react/public/expositor_PC.png" alt="Vista PC" width="70%" style="margin: 15px;"/>
  
  <img src="frontend-react/public/expositor_movil.png" alt="Vista Móvil" width="30%" style="margin: 15px;"/>
</div>

**Diseño Cyberpunk:** Colores neón, animaciones fluidas, interfaz modernista y totalmente responsive.

---

## 🎮 Experiencia de Usuario

### ✨ Interfaz Cyberpunk Moderna
- **Colores Neón:** Morado y azul fluorescente sobre fondos oscuros para máximo contraste
- **Animaciones:** Efectos fadeIn, scale, glow y gradientes en cada interacción
- **Shadowbox Radiante:** Elementos con efecto de luz neón que responden al hover
- **100% Responsive:** Perfecta en PC, tablet y móvil

### 💪 Diversión & Motivación
- Dashboard con estadísticas visuales reales
- Gráficas interactivas que muestran tu progreso
- Feedback visual en cada acción (notificaciones, animaciones)
- Accesibilidad integrada para que todos puedan entrenar

---

## 🛠️ Setup Local (Acceso Completo)

Para **probar todas las funcionalidades sin restricciones**, clona y ejecuta en tu máquina:

### Requisitos
- Node.js 18+
- MongoDB local o conexión a MongoDB Atlas

### Instalación

```bash
# 1. Clona el repo
git clone https://github.com/tu-usuario/UltimateGym-Project.git
cd UltimateGym-Project

# 2. Instala dependencias
npm install

# 3. Configura .env (opcional - funciona con valores por defecto en local)
cp .env.example .env

# 4. Carga datos de ejemplo (seeds)
node backend/seeds/index.js

# 5. Arranca todo (backend + frontend)
npm run dev:all
```

Abre [http://localhost:3000](http://localhost:3000) y explora la app **completa y sin restricciones**.

### Credenciales de Prueba (Local)
```
Email: demo@portfolio.com
Password: Demo123!

Email: admin@portfolio.com  (admin)
Password: Admin123!
```

---

## 📊 Características Técnicas

### Backend (Node.js + Express)
- Autenticación JWT con roles (user/admin)
- Validaciones completas con mensajes de error
- Seeds automáticos con imágenes de ejemplo
- Carga de archivos (PDF, imágenes) con Multer
- Agregaciones MongoDB para estadísticas en tiempo real
- CORS configurado
- Manejo de errores robusto

### Frontend (React + Vite)
- Context API para estado global (Auth, Accesibilidad)
- Componentes reutilizables
- CSS Modules + variables CSS
- Recharts para gráficas interactivas
- Responsive design mobile-first
- Widget de accesibilidad integrado

### Base de Datos
- MongoDB con Mongoose
- Modelos: Usuario, Clase, Ejercicio, Guía, InteraccionPaco
- Índices optimizados para búsquedas
- Seeds con datos consistentes

---


---

## ⚠️ Modo Demo (Limitaciones)

Si quieres **ver el proyecto rápido sin instalarlo**, usa la **[demo en vivo](https://ultimate-gym-project.vercel.app)**:

**👤 Cuenta Usuario Demo:**
```
Email: demo@portfolio.com
Password: Demo123!
```

**Limitaciones del usuario demo:**
- ❌ No puedes editar perfil de usuario
- ❌ No puedes cambiar contraseña
- ❌ No puedes eliminar la cuenta

**Lo que SÍ puedes hacer:**
- ✅ Ver todas las clases y ejercicios
- ✅ Inscribirse/desinscribirse en clases
- ✅ Descargar guías en PDF
- ✅ Ver estadísticas
- ✅ Explorar toda la interfaz

---

**🛡️ Cuenta Admin Demo (Solo Lectura):**
```
Email: admin@portfolio.com
Password: Admin123!
```

**Limitaciones del admin demo:**
- ❌ No puedes crear/editar/eliminar usuarios
- ❌ No puedes crear/editar/eliminar clases
- ❌ No puedes crear/editar/eliminar ejercicios
- ❌ No puedes crear/editar/eliminar guías

**Lo que SÍ puedes hacer:**
- ✅ Ver todo el panel de administración
- ✅ Ver todos los usuarios registrados
- ✅ Ver todas las clases con ocupación en tiempo real
- ✅ Ver la biblioteca completa de ejercicios y guías
- ✅ Ver estadísticas y gráficas avanzadas

**Para acceso COMPLETO** sin restricciones, [sigue el setup local](#-setup-local-acceso-completo) 👆

---

## 🔧 Configuración Avanzada (Opcional)

### n8n - Automatizaciones de Email y Datos

El proyecto está preparado para integrar **n8n** (webhooks para automatizaciones):

- **Envío automático de guías por email** a usuarios
- **Exportación de datos a Excel** con un click
- Otros flujos personalizados que diseñes

Configura `N8N_WEBHOOK_URL` en `.env` para activarlas. Sin esto, la app funciona normalmente.

**Ejemplo:** Con n8n puedes automatizar que al descargar una guía, se envíe un email confirmatorio. O exportar todos los usuarios a Excel automáticamente.

*(Si prefieres hacerlo sin n8n, el proyecto está listo para usar nodemailer, exceljs directamente en código)*

---

## 💻 Puntos Fuertes del Código

- ✅ **Estructura MVC clara** - Separación de concerns perfecta
- ✅ **Seeds automáticos** - Datos + imágenes precargadas
- ✅ **JWT + Roles** - Autenticación y autorización robusta
- ✅ **Estadísticas en tiempo real** - Agregaciones MongoDB optimizadas
- ✅ **Filtros bidireccionales** - Frontend + Backend
- ✅ **Admin panel completo** - CRUD para todas las entidades
- ✅ **Gráficas interactivas** - Recharts con datos dinámicos
- ✅ **Gestión de archivos** - Multer para PDF e imágenes
- ✅ **Accesibilidad WCAG** - No solo decoración, de verdad
- ✅ **Código limpio** - Comentado, sin funciones muertas
- ✅ **Env variables documentadas** - `.env.example` claro

---

## 📈 Despliegue en Vivo

- **Frontend:** [Vercel](https://ultimate-gym-project.vercel.app) ⚡
- **Backend:** [Render](https://ultimategym-project-portfolio.onrender.com) 🚀
- **Tipo:** SPA Fullstack con API RESTful

**Live demos:** El proyecto está **100% funcional en producción** con autoscaling y monitoreo.

---

## 🎯 Resumen

UltimateGym es un **portfolio fullstack profesional** que demuestra:

✔️ **Diseño moderno** - UI/UX atractiva y funcional  
✔️ **Architecture sólida** - MVC, JWT, roles, validaciones  
✔️ **Skills reales** - Desde frontend a backend, BD y DevOps  
✔️ **Accesibilidad inclusiva** - WCAG compliance integrado  
✔️ **Deploy profesional** - Vercel + Render en vivo  
✔️ **Código limpio** - Ready-to-hire  

---

## 📞 Contacto

**Iván Pons Martínez**

🔗 [LinkedIn](https://www.linkedin.com/in/iván-pons-martínez-617609183)  
💬 Sugerencias, feedback o solo decirme qué te parece → Mensaje en LinkedIn

---

**¡Gracias por pasarte por UltimateGym! 💪**