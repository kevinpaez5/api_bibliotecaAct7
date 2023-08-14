const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  correoElectronico: {
    type: String,
    required: true,
    unique: true
  },
  // Otros campos que desees agregar...
});

const Cliente = mongoose.model("Cliente", ClienteSchema);

module.exports = Cliente;