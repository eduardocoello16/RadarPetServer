const Mascota = require("../models/mascota");
const fs = require("fs");
const path = require("path");
const UsuarioController = require("../controllers/usuarioController");

async function createMascota(req, res) {
  try {
  const mascota = new Mascota();
  const params = JSON.parse(req.body.datos);
  if(!params.Nombre) throw {
    msg: "El nombre es obligatorio"
  }
  if(!req.files.foto) throw {
    msg: "La foto es obligatoria"
  }
    mascota.UserId = req.user.id;
    mascota.TipoEstado = params.TipoEstado;
    mascota.Nombre = params.Nombre;
    mascota.Ubicacion = params.Ubicacion;
    mascota.Tipo = params.Tipo;
    mascota.Raza = params.Raza;
    mascota.Edad = params.Edad;
    mascota.Tipocontacto = params.Tipocontacto;
    mascota.Descripcion = params.Descripcion;
    mascota.Peso = params.Peso;
    //Crear una expiración de 3 mesitos
    let date = new Date();
    date.setMonth(date.getMonth() + 3);
    mascota.FechaExpiracion = date;
    const filePath = req.files.foto.path;
    const fileSplit = filePath.split(process.env.split);
    const fileName = fileSplit[2];
    const extSplit = fileName.split(".");

    if (extSplit[1] != "png" && extSplit[1] != "jpg") throw {
      msg: "Extension no valida. Solo .png y .jpg"
    }
      mascota.Foto = fileName;
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
  console.log(error)
  if(!error.msg){
    error.msg = "Error en el servidor"
  }
  res.status(500).send(error);

}
}

async function getMascotas(req, res) {
  try {
    var listaMascotas = await Mascota.find().sort({
      FechaCreacion: -1
    });
    listaMascotas = listaMascotas.filter(mascota => mascota.FechaExpiracion >= new Date());
    if (!listaMascotas) {
      res.status(400).send({
        msg: "Error al obtener las Mascotas"
      });
    } else {
      res.status(200).send(listaMascotas);
    }
  } catch (error) {
    if(!error.msg){
      error.msg = "Error en el servidor"
    }
    res.status(500).send(error);
  }
}
async function getMascotasFromUser(req, res) {
  try {
  let mascotas = await UsuarioController.getMascotas(req.user);
  if (!mascotas) throw {
    msg: "La mascota no se encontró en la base de datos del usuario"
  }
    var listaMascotas = [];
    while (mascotas.length > 0) {
      const mascota = await Mascota.findById(mascotas[mascotas.length - 1]);
      if (!mascota) {
        mascotas.pop();
      }else{
        listaMascotas.push(mascota);
        mascotas.pop()
      }
     
    }
    res.status(200).send(listaMascotas);
  
} catch (error) {
  res.status(500).send(error);
}
}

async function getMascota(req, res) {
  const idMascota = req.params.id;

  try {
    const mascota = await Mascota.findById(idMascota).populate("UserId");
    console.log('d')
    if (!mascota) {
      res.status(400).send({
        msg: "No se ha encontrado la Mascota"
      });
    } else {
      let contacto
      if(mascota.Tipocontacto === 'tel'){
          contacto = mascota.UserId.telefono
        }else{
          contacto = mascota.UserId.email
        }
      const mascotaReturn = {
        mascota: mascota,
        contacto: contacto
      }
     
      res.status(200).send(mascotaReturn);
    }
  } catch (error) {
    console.log(error)
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

async function caducidadMascota(req, res) {
  idMascota = req.params.id;
  try {
    const mascota = await Mascota.findById(idMascota);
    if (!mascota) {
      res.status(400).send({
        msg: "no se ha encontrado la mascota"
      });
    } else {
      if (mascota.FechaExpiracion < new Date()) {
        mascota.FechaExpiracion = new Date().setMonth(new Date().getMonth() + 3);
        mascota.save();
        res.status(200).send({
          msg: "Se ha actualizado correctamete"
        });
      } else {
        res.status(400).send({
          msg: "La mascota no ha caducado"
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }


}

async function updateDatos(req, res) {
  // const params = JSON.parse(req.body.datos);
try {
  const mascotaUser = await UsuarioController.buscaMascota(req.user, req.params.id);
  if (!mascotaUser) throw {
      msg: "No tienes permisos para actualizar los datos"
  } 
    if (req.files.foto) {
      const filePath = req.files.foto.path;
      const fileSplit = filePath.split(process.env.split);
      const fileName = fileSplit[2];
      const extSplit = fileName.split(".");
      if (extSplit[1] != "png" && extSplit[1] != "jpg") throw {
        msg: "Extension no valida. Solo .png y .jpg"
      }
          if (fs.existsSync(`./uploads/fotosMascotas/${mascotaUser.Foto}`)) {
            fs.unlinkSync(`./uploads/fotosMascotas/${mascotaUser.Foto}`);
          }
          mascotaUser.Foto = fileName;
         
     
    }
      if (req.body.datos) {
        let params = JSON.parse(req.body.datos);
          const mascota = await Mascota.findByIdAndUpdate(mascotaUser.id, params);
          if (!mascota) throw{
              msg: "no se ha encontrado la mascota"
          }
      }
      mascotaUser.save();
      res.status(200).send({
        msg: "Datos Actualizados"
      });
    } catch (error) {
      res.status(500).send(error);
    }

  }

module.exports = {
  createMascota,
  getMascotas,
  getMascota,
  getMascotasFromUser,
  delMascota,
  getFoto,
  updateDatos,
  caducidadMascota
};