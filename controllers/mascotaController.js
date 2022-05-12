const Mascota = require("../models/mascota");
const fs = require("fs");
const path = require("path");
const UsuarioController = require("../controllers/usuarioController");
async function createMascota(req, res) {
  const mascota = new Mascota();
  const params = JSON.parse(req.body.datos);

  if (params.Nombre && req.files.foto) {
    mascota.Nombre = params.Nombre;
    mascota.Ubicacion = params.Ubicacion;
    mascota.Tipo = params.Tipo;
    mascota.Raza = params.Raza;
    mascota.Edad = params.Edad;
    mascota.Descripcion = params.Descripcion;
    mascota.Peso = params.Peso;
    
    const filePath = req.files.foto.path;
    console.log(filePath);
    const fileSplit = filePath.split(process.env.split);
    console.log(process.env.split);
    const fileName = fileSplit[2];
    const extSplit = fileName.split(".");

    if (extSplit[1] === "png" || extSplit[1] === "jpg") {
      mascota.Foto = fileName;
      try {
        const mascotaStore = await mascota.save();
        if (!mascotaStore) {
          res.status(400).send({
            msg: "No se ha podído guardar el bicho"
          });
        } else {
          UsuarioController.addMascota(req.user, mascotaStore);
          res.status(200).send({
            Mascota: mascotaStore
          });
        }
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(500).send({
        msg: "Extension no valida. Solo .png y .jpg"
      });
    }
  } else {
    res.status(500).send({
      msg: "No se ha subido ninguna foto"
    });
  }
}

async function getMascotas(req, res) {
  try {
    const listaMascotas = await Mascota.find().sort({
      FechaCreacion: -1
    });
    if (!listaMascotas) {
      res.status(400).send({
        msg: "Error al obtener las Mascotas"
      });
    } else {
      res.status(200).send(listaMascotas);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
async function getMascotasFromUser(req, res) {
  let mascotas = await UsuarioController.getMascotas(req.user);
  if (!mascotas) {
    res.status(400).send({
      msg: "Error al obtener las tareas"
    });
  } else {
    var listaMascotas = [];
    for (let i = 0; i < mascotas.length; i++) {
      const mascota = await Mascota.findById(mascotas[i]);
      listaMascotas.push(mascota);
    }
    res.status(200).send(listaMascotas);
  }
}

async function getMascota(req, res) {
  const idMascota = req.params.id;

  try {
    const mascota = await Mascota.findById(idMascota);

    if (!mascota) {
      res.status(400).send({
        msg: "no se ha encontrado la tarea"
      });
    } else {
      res.status(200).send(mascota);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function editMascota(req, res) {
  const idMascota = req.params.id;
  const params = req.body;

  try {
    const mascota = await Mascota.findByIdAndUpdate(idMascota, params);

    if (!mascota) {
      res.status(400).send({
        msg: "no se ha encontrado la mascota"
      });
    } else {
      res.status(200).send({
        msg: "Se ha actualizado correctamet"
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
async function delMascota(req, res) {
  const idMascota = req.params.id;

  try {
    const mascota = await Mascota.findByIdAndDelete(idMascota);

    if (!mascota) {
      res.status(400).send({
        msg: "No se ha encontrado la Mascota"
      });
    } else {
      if (fs.existsSync(`./uploads/fotosMascotas/${mascota.Foto}`)) {
        fs.unlinkSync(`./uploads/fotosMascotas/${mascota.Foto}`);
      }
      UsuarioController.deleteMascota(req.user, idMascota);
      res.status(200).send({
        msg: "Se ha eliminado correctamente"
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
async function getFoto(req, res) {
  try {
    const mascota = await Mascota.findOne({
      _id: req.params.id
    });
    if (!mascota) throw {
      msg: "Error en el mail o password"
    };
    const filePath = `./uploads/fotosMascotas/${mascota.Foto}`;
    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.status(404).send({
          msg: "No existe el archivo"
        });
      } else {
        res.sendFile(path.resolve(filePath));
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function updateDatos(req, res) {
 // const params = JSON.parse(req.body.datos);

    const mascotaUser = await UsuarioController.buscaMascota(req.user, req.params.id);
    if (!mascotaUser) {
      res.status(400).send({
        msg: "No tienes permisos para actualizar los datos"
      });
    } else {
      console.log(req.files);
      if(req.files.foto){
      const filePath = req.files.foto.path;
      const fileSplit = filePath.split(process.env.split);
      const fileName = fileSplit[2];
      const extSplit = fileName.split(".");
      if (extSplit[1] === "png" || extSplit[1] === "jpg") {
        try {
          if (fs.existsSync(`./uploads/fotosMascotas/${mascotaUser.Foto}`)) {
            fs.unlinkSync(`./uploads/fotosMascotas/${mascotaUser.Foto}`);
          }
          mascotaUser.Foto = fileName;
          mascotaUser.save();
          res.status(200).send({
            msg: "Avatar actualizado"
          })
        } catch (error) {
          res.status(500).send({
            msg: "Error interno del servidor al eliminar tu antiguo avatar"
          })
        }
      }
    } else {
      if(req.body.datos){
        let params = JSON.parse(req.body.datos);
        try {
          const mascota = await Mascota.findByIdAndUpdate(mascotaUser.id, params);
      
          if (!mascota) {
            res.status(400).send({
              msg: "no se ha encontrado la mascota"
            });
          } else {
            res.status(200).send({
              msg: "Se ha actualizado correctamet"
            });
          }
        } catch (error) {
          res.status(500).send(error);
          console.log(error)
        }
        }
      }


    }

}

module.exports = {
  createMascota,
  getMascotas,
  getMascota,
  editMascota,
  getMascotasFromUser,
  delMascota,
  getFoto,
  updateDatos
};