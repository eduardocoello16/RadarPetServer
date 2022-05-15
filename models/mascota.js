const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MascotaSchema = Schema({
  TipoEstado: {
    type: String,
    enum: ["Perdido", "Encontrado"],
    required: [true, "¿Has perdido o encontrado una mascota? Falta El campo TipoEstado"]
  },
  Nombre: {
    type: String,
    require: [true, "Debes insertar un Nombre a tu mascota"]
  },
  Tipo: {
    type: String,
    //Restringir el tipo de mascota
    enum: ["Perro", "Gato", "Pajaro", "Otro"],
    default: "Otro",
    require: [true, "El campo de Tipo es requerido"],
  },
  Descripcion: {
    type: String,
  },
  Raza: {
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
    editable: false,
    default: Date.now,
  },
  FechaExpiracion: {
    type: Date
  },  //30 dias       
  Foto: {
    type: String,
    require: true,
    
  }
});



module.exports = mongoose.model("Mascota", MascotaSchema);
