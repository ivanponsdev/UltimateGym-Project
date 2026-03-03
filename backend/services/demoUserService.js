const bcrypt = require('bcryptjs');
const User = require('../models/Usuario');

const DEMO_USER_EMAIL = (process.env.DEMO_USER_EMAIL || 'demo@portfolio.com').toLowerCase();
const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'Demo123!';
const DEMO_USER_NAME = process.env.DEMO_USER_NAME || 'Usuario Demo';

const DEMO_ADMIN_EMAIL = (process.env.DEMO_ADMIN_EMAIL || 'admin@portfolio.com').toLowerCase();
const DEMO_ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || 'Admin123!';
const DEMO_ADMIN_NAME = process.env.DEMO_ADMIN_NAME || 'Admin Demo';

const ensureSingleDemoUser = async ({ email, password, name, role, isDemo, isDemoAdmin }) => {
  let user = await User.findOne({ email });

  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      nombre: name,
      email,
      password: hashedPassword,
      edad: 26,
      sexo: 'otro',
      objetivo: 'recomposicion_corporal',
      objetivoClasesSemana: 4,
      role,
      isDemo: isDemo || false,
      isDemoAdmin: isDemoAdmin || false,
      primerAcceso: false,
      requiereActualizacionContraseña: false
    });
    console.log(`Cuenta demo creada automáticamente: ${user.email}`);
  } else {
    let needsUpdate = false;
    if (isDemo && !user.isDemo) { user.isDemo = true; needsUpdate = true; }
    if (isDemoAdmin && !user.isDemoAdmin) { user.isDemoAdmin = true; needsUpdate = true; }
    if (user.primerAcceso) { user.primerAcceso = false; needsUpdate = true; }
    if (user.requiereActualizacionContraseña) { user.requiereActualizacionContraseña = false; needsUpdate = true; }
    if (needsUpdate) await user.save();
    console.log(`Cuenta demo verificada: ${user.email}`);
  }
};

const ensureDemoUser = async () => {
  try {
    // Usuario demo normal (solo lectura de perfil)
    await ensureSingleDemoUser({
      email: DEMO_USER_EMAIL,
      password: DEMO_USER_PASSWORD,
      name: DEMO_USER_NAME,
      role: 'user',
      isDemo: true,
    });

    // Usuario admin demo (acceso read-only al panel admin)
    await ensureSingleDemoUser({
      email: DEMO_ADMIN_EMAIL,
      password: DEMO_ADMIN_PASSWORD,
      name: DEMO_ADMIN_NAME,
      role: 'admin',
      isDemoAdmin: true,
    });
  } catch (error) {
    console.error('Error al asegurar cuentas demo:', error.message);
  }
};

module.exports = ensureDemoUser;
