const express = require('express')
const cors = require('cors')
const md_auth = require("../middlewares/authenticated")
const MascotaController = require("../controllers/mascotaController")
const api = express.Router();
api.use(cors())
api.post("/nueva", [md_auth.ensureAuth], MascotaController.createMascota)
api.get("/getFromUser", [md_auth.ensureAuth], MascotaController.getMascotasFromUser)
api.get("/mascotas", MascotaController.getMascotas)
api.get("/mascota/:id", MascotaController.getMascota)
api.put("/mascota/:id", MascotaController.editMascota)
api.delete("/mascota/:id", MascotaController.delMascota)
module.exports = api;