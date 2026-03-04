// Script puntual para insertar las 6 guías PDF en MongoDB
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
// Soporte para ambos nombres de variable
process.env.MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Guia = require('../models/Guia');

const guias = [
  {
    titulo: 'Alimentación para Aumento de Masa Muscular',
    descripcion: 'Guía nutricional completa para maximizar el crecimiento muscular. Incluye distribución de macros, alimentos recomendados y timing nutricional.',
    objetivo: 'aumento_masa_muscular',
    archivoUrl: 'uploads/guias/alimentacion-masa-muscular.pdf.pdf',
    activa: true
  },
  {
    titulo: 'Alimentación para Pérdida de Grasa',
    descripcion: 'Hábitos nutricionales para la pérdida de grasa sostenible. Déficit calórico saludable, control del hambre y adherencia a largo plazo.',
    objetivo: 'perdida_grasa',
    archivoUrl: 'uploads/guias/alimentación-perdida-grasa.pdf.pdf',
    activa: true
  },
  {
    titulo: 'Alimentación para Recomposición Corporal',
    descripcion: 'Estrategias alimentarias para perder grasa y ganar músculo simultáneamente. Balance calórico y distribución de macros.',
    objetivo: 'recomposicion_corporal',
    archivoUrl: 'uploads/guias/alimentacion-mantenimiento.pdf.pdf',
    activa: true
  },
  {
    titulo: 'Entrenamiento para Aumento de Masa Muscular',
    descripcion: 'Rutinas y hábitos de entrenamiento enfocados en hipertrofia. Frecuencia semanal, selección de ejercicios y rangos de repeticiones.',
    objetivo: 'aumento_masa_muscular',
    archivoUrl: 'uploads/guias/entrenamiento-masa-muscular.pdf (1).pdf',
    activa: true
  },
  {
    titulo: 'Entrenamiento para Pérdida de Grasa',
    descripcion: 'Estrategias de entrenamiento para maximizar la quema de grasa. Combinación de entrenamiento de fuerza y cardio estratégico.',
    objetivo: 'perdida_grasa',
    archivoUrl: 'uploads/guias/entrenamiento-perdida-grasa.pdf (1) (2).pdf',
    activa: true
  },
  {
    titulo: 'Entrenamiento para Recomposición Corporal',
    descripcion: 'Programa de entrenamiento combinado de fuerza y acondicionamiento para perder grasa y ganar músculo.',
    objetivo: 'recomposicion_corporal',
    archivoUrl: 'uploads/guias/entrenamiento-mantenimiento.pdf (1).pdf',
    activa: true
  }
];

const run = async () => {
  await connectDB();

  // Eliminar solo guías cuyo archivoUrl coincida con estos archivos (evita duplicados)
  const urls = guias.map(g => g.archivoUrl);
  await Guia.deleteMany({ archivoUrl: { $in: urls } });

  const resultado = await Guia.insertMany(guias);
  console.log(`✓ ${resultado.length} guías insertadas correctamente`);

  await mongoose.connection.close();
};

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
