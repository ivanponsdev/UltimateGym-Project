const Usuario = require('../models/Usuario');
const Clase = require('../models/Clase');

exports.getExportUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al exportar usuarios' });
  }
};

exports.getExportClasses = async (req, res) => {
  try {
    const clases = await Clase.find({});
    res.json(clases);
  } catch (error) {
    res.status(500).json({ error: 'Error al exportar clases' });
  }
};

exports.getExportStats = async (req, res) => {
  return res.status(501).json({ message: 'Exportación de estadísticas no implementada aún' });
};
