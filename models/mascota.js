const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MascotaSchema = Schema({
  Nombre: {
    type: String,
    require: true,
  },
  Tipo: {
    type: String,
    require: true,
  },
  Descripcion: {
    type: String,
  },
  Ubicacion: {
    type: Object,
    require: true,
  },
  Edad: {
    type: Number,
  },
  Peso: {
    type: String
  },
 
  FechaCreacion: {
    type: Date,
    
    default: Date.now,
  },
  Foto: {
    type: String,
    require: true,
    
  }
});



module.exports = mongoose.model("Mascota", MascotaSchema);
