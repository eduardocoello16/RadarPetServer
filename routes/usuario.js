const express = require('express')
const multipart = require('connect-multiparty')
const cors = require('cors')
const UsuarioController = require("../controllers/usuarioController")

const md_auth = require("../middlewares/authenticated")
const md_upload = multipart({ uploadDir: './uploads/usuarios' })

const api = express.Router();
api.use(cors())
api.post("/registrarse", UsuarioController.registrarUsuario)
api.post("/iniciarsesion", UsuarioController.iniciarSesion)
api.put("/uploadAvatar",[md_auth.ensureAuth, md_upload], UsuarioController.uploadAvatar)
api.get("/getAvatar", [md_auth.ensureAuth], UsuarioController.getAvatar)
api.get("/getUsuario", [md_auth.ensureAuth], UsuarioController.getUsuario)
module.exports = api;