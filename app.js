const express = require('express')
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//Cargar Routes
const mascota_routes = require("./routes/mascota")
const usuario_routes = require("./routes/usuario")

// Ruta base
app.use("/mascota", mascota_routes)
app.use("/usuario", usuario_routes)

module.exports = app;