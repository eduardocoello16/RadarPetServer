const express = require('express')
const cors = require('cors')
const MascotaController = require("../controllers/mascotaController")
const api = express.Router();
api.use(cors())
api.post("/nueva", MascotaController.createMascota)
api.get("/mascotas", MascotaController.getMascotas)
api.get("/mascota/:id", MascotaController.getMascota)
api.put("/mascota/:id", MascotaController.editMascota)
api.delete("/mascota/:id", MascotaController.delMascota)
module.exports = api;