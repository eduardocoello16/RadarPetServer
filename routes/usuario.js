const express = require('express')
const cors = require('cors')
const UsuarioController = require("../controllers/usuarioController")
const api = express.Router();
api.use(cors())
api.post("/registrarse", UsuarioController.registrarUsuario)
api.post("/iniciarsesion", UsuarioController.iniciarSesion)
module.exports = api;