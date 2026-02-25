const Usuario = require('../models/Usuario');
const Guia = require('../models/Guia');
const axios = require('axios');

// Enviar guía por email a través de n8n (solo envío individual)
exports.sendGuidesEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guiaId } = req.body;
    
    if (!guiaId) {
      return res.status(400).json({ error: 'guiaId es requerido' });
    }
    
    
    // Obtener usuario autenticado
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener la guía
    const guia = await Guia.findById(guiaId);
    if (!guia) {
      return res.status(404).json({ error: 'Guía no encontrada' });
    }

    // Preparar datos para enviar a n8n
    const datosN8n = {
      userEmail: usuario.email,
      userName: usuario.nombre,
      userObjectivo: usuario.objetivo,
      titulo: guia.titulo,
      descripcion: guia.descripcion,
      objetivo: guia.objetivo,
      archivoUrl: guia.archivoUrl,
      fullUrl: `${process.env.BACKEND_URL || 'http://localhost:5001'}/${guia.archivoUrl}`
    };

    console.log('📧 DATOS ENVIADOS A N8N:', JSON.stringify(datosN8n, null, 2));

    // Llamar al webhook de n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      return res.status(500).json({ 
        error: 'Webhook de n8n no configurado' 
      });
    }

    await axios.post(n8nWebhookUrl, datosN8n);

    res.json({ 
      success: true, 
      message: `Email enviado a ${usuario.email} con la guía: ${guia.titulo}` 
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ 
      error: 'Error al enviar email',
      details: error.message 
    });
  }
};

// Obtener estado del último envío
exports.getLastEmailStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Placeholder 
    res.json({ 
      status: 'success',
      lastSend: new Date(),
      message: 'Función disponible para expansión futura'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
