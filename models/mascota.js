const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MascotaSchema = Schema({
  Nombre: {
    type: String,
    require: true,
  },

  Ubicacion: {
    type: Object,
    require: true,
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
