const express = require('express')
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//Cargar Routes
const mascota_routes = require("./routes/mascota")

// Ruta base
app.use("/mascota", mascota_routes)

module.exports = app;