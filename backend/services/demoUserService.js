const bcrypt = require('bcryptjs');
const User = require('../models/Usuario');

const DEMO_USER_EMAIL = (process.env.DEMO_USER_EMAIL || 'demo@portfolio.com').toLowerCase();
const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'Demo123!';
const DEMO_USER_NAME = process.env.DEMO_USER_NAME || 'Usuario Demo';

const ensureDemoUser = async () => {
  try {
    let demoUser = await User.findOne({
      $or: [
        { email: DEMO_USER_EMAIL },
        { isDemo: true }
      ]
    });

    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(DEMO_USER_PASSWORD, salt);

      demoUser = await User.create({
        nombre: DEMO_USER_NAME,
        email: DEMO_USER_EMAIL,
        password: hashedPassword,
        edad: 26,
        sexo: 'otro',
        objetivo: 'recomposicion_corporal',
        objetivoClasesSemana: 4,
        role: 'user',
        isDemo: true,
        primerAcceso: false,
        requiereActualizacionContraseña: false
      });

      console.log(`Cuenta demo creada automáticamente: ${demoUser.email}`);
      return;
    }

    let needsUpdate = false;
    if (!demoUser.isDemo) {
      demoUser.isDemo = true;
      needsUpdate = true;
    }
    if (demoUser.primerAcceso) {
      demoUser.primerAcceso = false;
      needsUpdate = true;
    }
    if (demoUser.requiereActualizacionContraseña) {
      demoUser.requiereActualizacionContraseña = false;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await demoUser.save();
    }

    console.log(`Cuenta demo verificada: ${demoUser.email}`);
  } catch (error) {
    console.error('Error al asegurar cuenta demo:', error.message);
  }
};

module.exports = ensureDemoUser;
