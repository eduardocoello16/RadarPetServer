const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: false
    },
    apellido: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    telefono: {
        type: String,
        require: false
    },
    mascotas: {
        type: Array,
        require: false,
        default: []
    },
    avatar: {
        type: String,
        require: false
    }

})

module.exports = mongoose.model("Usuario", UsuarioSchema)