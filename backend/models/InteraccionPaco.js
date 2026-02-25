const mongoose = require('mongoose')

const interaccionPacoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tipo: { type: String, enum: ['apertura', 'conversacion'], default: 'apertura' }
}, { timestamps: true })

module.exports = mongoose.model('InteraccionPaco', interaccionPacoSchema)
