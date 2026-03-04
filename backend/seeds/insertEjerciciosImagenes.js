// Script puntual para asociar imágenes de técnica a los ejercicios en MongoDB
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
process.env.MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Ejercicio = require('../models/Ejercicio');

// Mapa completo: nombre del ejercicio en BD → ruta de imagen en uploads/ejercicios/
const imagenes = [
  { nombre: 'Press de banca',            imagenTecnica: 'uploads/ejercicios/press_banca.png' },
  { nombre: 'Flexiones',                 imagenTecnica: 'uploads/ejercicios/flexiones.png' },
  { nombre: 'Aperturas con mancuernas',  imagenTecnica: 'uploads/ejercicios/apertura_mancuernas.png' },
  { nombre: 'Fondos en paralelas',       imagenTecnica: 'uploads/ejercicios/fondos_paralelas.png' },
  { nombre: 'Dominadas',                 imagenTecnica: 'uploads/ejercicios/dominadas.png' },
  { nombre: 'Remo con barra',            imagenTecnica: 'uploads/ejercicios/remo_conbarra.png' },
  { nombre: 'Peso muerto',               imagenTecnica: 'uploads/ejercicios/peso_muerto.png' },
  { nombre: 'Remo invertido',            imagenTecnica: 'uploads/ejercicios/remo_invertido.png' },
  { nombre: 'Sentadillas con barra',     imagenTecnica: 'uploads/ejercicios/sentadilla_con_barra.png' },
  { nombre: 'Zancadas',                  imagenTecnica: 'uploads/ejercicios/zancadas.png' },
  { nombre: 'Prensa de piernas',         imagenTecnica: 'uploads/ejercicios/prensa_piernas.png' },
  { nombre: 'Sentadillas búlgaras',      imagenTecnica: 'uploads/ejercicios/sentadillas_bulgaras.png' },
  { nombre: 'Curl femoral',              imagenTecnica: 'uploads/ejercicios/curl_femoral.png' },
  { nombre: 'Press militar',             imagenTecnica: 'uploads/ejercicios/press_militar.png' },
  { nombre: 'Elevaciones laterales',     imagenTecnica: 'uploads/ejercicios/elevaciones_laterales_mancuerna.png' },
  { nombre: 'Elevaciones frontales',     imagenTecnica: 'uploads/ejercicios/elevaciones_frontales.png' },
  { nombre: 'Pájaros',                   imagenTecnica: 'uploads/ejercicios/deltoides_posteriores.png' },
  { nombre: 'Curl de bíceps con barra',  imagenTecnica: 'uploads/ejercicios/curl_biceps.png' },
  { nombre: 'Extensiones de tríceps',    imagenTecnica: 'uploads/ejercicios/extension_triceps.png' },
  { nombre: 'Curl martillo',             imagenTecnica: 'uploads/ejercicios/curl_martillo.png' },
  { nombre: 'Press francés',             imagenTecnica: 'uploads/ejercicios/press_frances.png' },
  { nombre: 'Plancha',                   imagenTecnica: 'uploads/ejercicios/plancha.png' },
  { nombre: 'Abdominales crunch',        imagenTecnica: 'uploads/ejercicios/abdominales_crunch.png' },
  { nombre: 'Elevaciones de piernas',    imagenTecnica: 'uploads/ejercicios/elevaciones_piernas.png' },
  { nombre: 'Russian twist',             imagenTecnica: 'uploads/ejercicios/russian_twist.png' },
  { nombre: 'Mountain climbers',         imagenTecnica: 'uploads/ejercicios/mountain_climbers.png' },
];

const run = async () => {
  await connectDB();

  let actualizados = 0;
  let noEncontrados = [];

  for (const { nombre, imagenTecnica } of imagenes) {
    const result = await Ejercicio.updateOne(
      { nombre },
      { $set: { imagenTecnica } }
    );
    if (result.matchedCount === 0) {
      noEncontrados.push(nombre);
    } else {
      actualizados++;
      console.log(`✓ ${nombre} → ${imagenTecnica}`);
    }
  }

  console.log(`\n✅ ${actualizados} ejercicios actualizados con imagen.`);
  if (noEncontrados.length) {
    console.warn(`⚠️  No encontrados en BD: ${noEncontrados.join(', ')}`);
  }

  await mongoose.connection.close();
};

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
