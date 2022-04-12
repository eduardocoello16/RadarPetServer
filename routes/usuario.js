const express = require('express')
const cors = require('cors')
const UsuarioController = require("../controllers/usuarioController")
const md_auth = require("../middlewares/authenticated")
const api = express.Router();
api.use(cors())
api.post("/registrarse", UsuarioController.registrarUsuario)
api.post("/iniciarsesion", UsuarioController.iniciarSesion)

api.get("/getUsuario", [md_auth.ensureAuth], UsuarioController.getUsuario)
module.exports = api;