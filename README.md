# UltimateGym

**Autor:** Iván Pons Martínez

[![Licencia: CC BY-NC-ND 4.0](https://img.shields.io/badge/Licencia-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

> **Licencia:**
> Este proyecto es solo para fines educativos y de portfolio. Puedes clonar, probar y aprender, pero **no puedes venderlo ni publicarlo como proyecto propio**  Más info en el archivo LICENSE. Para cualquiera de estas acciones comerciales, puedes contactar conmigo a través de mis canales.

¡Bienvenido/a a UltimateGym! 🏋️‍♂️

Este es mi proyecto fullstack para aprender, practicar y enseñar cómo montar una app de gimnasio moderna, con frontend en React (Vite) y backend Node.js/Express/MongoDB. Si eres recruiter, compi dev o simplemente te gusta, aquí tienes un ejemplo realista y funcional.

---

## ¿Qué es esto?

Una SPA donde puedes:
- Registrarte y loguearte (JWT, roles user/admin)
- Ver y apuntarte a clases de gimnasio
- Consultar y filtrar ejercicios (con imágenes)
- Descargar guías en PDF
- Panel de admin para gestionar usuarios, clases, ejercicios y guías
- Estadísticas y exportación de datos
- Accesibilidad real (widgets, skiplinks, contraste, etc)

Todo con seeds de ejemplo para que lo veas funcionando nada más clonar.

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
   npm install

4. Ejecuta los seeds para tener datos de ejemplo:
   node backend/seeds/index.js
  
5. Arranca todo (backend y frontend a la vez):
   npm run dev:all

6. Abre [http://localhost:3000](http://localhost:3000) y juega

## Cosas interesantes del código

- Estructura clara: MVC en backend, componentes y contextos en frontend
- Seeds con imágenes de ejemplo (¡no más apps vacías al clonar!)
- Accesibilidad de verdad, no solo por cumplir
- Código comentado y limpio, sin relleno ni funciones muertas
- Variables de entorno bien documentadas
- Filtros y búsquedas en frontend y backend
- Panel admin real, no solo "para la demo"

---

## ¿Por qué lo subo así?

Porque quiero que quien lo vea pueda probarlo sin pelearse con dependencias, seeds, ni configuraciones raras. Y porque si buscas a alguien que sepa montar proyectos reales, aquí tienes un ejemplo de cómo lo haría yo.

---

## Licencia

MIT. Haz lo que quieras, pero si te mola, ¡dímelo por LinkedIn! 😉