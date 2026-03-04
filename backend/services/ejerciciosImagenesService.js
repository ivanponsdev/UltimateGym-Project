const Ejercicio = require('../models/Ejercicio');

// Mapa completo: nombre exacto en BD → ruta de imagen en uploads/ejercicios/
const IMAGENES_MAP = [
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

const ensureEjerciciosImagenes = async () => {
  try {
    let actualizados = 0;
    for (const { nombre, imagenTecnica } of IMAGENES_MAP) {
      const result = await Ejercicio.updateOne(
        { nombre, $or: [{ imagenTecnica: '' }, { imagenTecnica: { $exists: false } }] },
        { $set: { imagenTecnica } }
      );
      if (result.modifiedCount > 0) actualizados++;
    }
    if (actualizados > 0) {
      console.log(`✓ Imágenes de técnica asociadas a ${actualizados} ejercicios`);
    } else {
      console.log('✓ Imágenes de ejercicios ya actualizadas');
    }
  } catch (error) {
    console.error('Error al asociar imágenes de ejercicios:', error.message);
  }
};

module.exports = ensureEjerciciosImagenes;
