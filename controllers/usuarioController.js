const fs = require('fs');
const Mascota = require("../models/mascota");
const path = require('path');
const Usuario = require("../models/ususario");
const bcryptjs = require("bcryptjs");
const jwt = require("../services/jwt");


async function registrarUsuario(req, res){
   
    const params = JSON.parse(req.body.datos);

    
    try {
        if(!params.email) throw {msg: "Email Vacio"};
        if(!params.password) throw {msg: "Pass Vacio"};
        const foundEmail = await Usuario.findOne({email : params.email})
        if(foundEmail) throw {msg: "Email en uso"}
        const salt = bcryptjs.genSaltSync(10)
        const nuevoUsuario = new Usuario();
        nuevoUsuario.password = await bcryptjs.hash(params.password, salt)
        nuevoUsuario.email = params.email
        nuevoUsuario.nombre = params.nombre
        nuevoUsuario.apellido = params.apellido
        if(req.files.avatar){
            const filePath = req.files.avatar.path;
                    const fileSplit = filePath.split('/');
                    const fileName = fileSplit[2];
                    const extSplit = fileName.split(".");
                    if(extSplit[1] === 'png'  || extSplit[1] === 'jpg') {
                        nuevoUsuario.avatar = fileName;
                        nuevoUsuario.save();
                        res.status(200).send({msg: "Usuario registrado"})
                        
                    }
                else{
                    res.status(500).send({msg: "Extension no valida. Solo .png y .jpg"});
                }
        }else{
            nuevoUsuario.save();
            res.status(200).send({msg: "Usuario registrado"})
           
        }
    
       
    } catch (error) {
        res.status(500).send(error)
    }
}


async function iniciarSesion(req, res){
    const {email , password} = req.body;
   try {
       const usuario = await Usuario.findOne({email});
       if(!usuario) throw {msg: "Error en el mail o password"}
       const passwordSuccess = await bcryptjs.compare(password, usuario.password)
       if(!passwordSuccess) throw {msg: "Error en el mail o password"}
       res.status(200).send({
           // Para añadir time jwt.createToken(usuario , "1 day || 1 week || 1 month")
           token: jwt.crearToken(usuario, "1 week"),
        })
   } catch (error) {
       res.status(500).send(error)
       console.log(error)
   }
}


async function getUsuario(req, res){
   try {
         const user = {
                id: req.user.id,
                nombre: req.user.nombre,
                email: req.user.email
         }
    res.status(200).send(user)
   
} catch (error) {
    res.status(500).send(error)
}
}

function uploadAvatar(req, res) {
    if(req.files.avatar){
 try {
    Usuario.findById({_id: req.user.id} , (err, usuario) => {
        if(err) {
            res.status(500).send({msg: "Error al buscar el usuario"})
        }else{
            if(!usuario) {
                res.status(404).send({msg: "No existe el usuario"})
            }else{
                let user = usuario;
                if(req.files) {
                    const filePath = req.files.avatar.path;
                    const fileSplit = filePath.split('/');
                    const fileName = fileSplit[2];
                    const extSplit = fileName.split('\.');
                   
                    if(extSplit[1] === 'png'  || extSplit[1] === 'jpg') {
                        try {
                            if (fs.existsSync(`./uploads/usuarios/${user.avatar}`)) {
                            fs.unlinkSync(`./uploads/usuarios/${user.avatar}`);
                        }
                            res.status(200).send({msg: "Avatar actualizado"})
                        } catch (error) {
                            res.status(500).send({msg: "Error interno del servidor al eliminar tu antiguo avatar"})
                        }
                        user.avatar = fileName;
                        user.save();
                    }
                else{
                    res.status(500).send({msg: "Extension no valida. Solo .png y .jpg"});
                }
            }
            }
        }
    }) 

     
 } catch (error) {
     console.log(error)
 }
     
 }else{
     res.status(500).send({msg: "No se ha subido ningun archivo"})
 }
}
async function getAvatar(req, res){
    try {
        const usuario = await Usuario.findOne( {_id: req.user.id});
    if(!usuario) throw {msg: "Error en el mail o password"}
    const filePath = `./uploads/usuarios/${usuario.avatar}`;
    fs.stat(filePath, (err, stats) => {
        if(err) {
            res.status(404).send({msg: "No existe el archivo"})
        }else{
            res.sendFile(path.resolve(filePath))
        }
    })
    } catch (error) {
        res.status(500).send(error)
    }
    
    

}

//Funciones para Mascotas con el usuario 
async function getMascotas(user) {
  const usuario = await Usuario.findOne( {_id: user.id});
    if(!usuario) throw {msg: "Error en el mail o password"}
    return usuario.mascotas; //Devuelve un array de id de mascotas
}
async function addMascota(user, mascota) {
    //Meter una mascota al usuario 
    try {
    const usuario = await Usuario.findByIdAndUpdate( {_id: user.id});
    usuario.mascotas.push(mascota.id)
    usuario.save();
    } catch (error) {
        console.log(error)
    }
  }
  async function buscaMascota(user, idMascota) {
    //Meter una mascota al usuario 
    try {
    const usuario = await Usuario.findByIdAndUpdate( {_id: user.id});
    const mascotaEncontrada = usuario.mascotas.find(idMascota => idMascota === idMascota);
    if(!mascotaEncontrada) { return null }
    else{
        const mascota = await Mascota.findById(idMascota);
        return mascota;
    }
    } catch (error) {
        console.log(error)
    }
  }

    async function deleteMascota(user, idMascota) {
        //Borrar una mascota del array 
        try {
        const usuario = await Usuario.findByIdAndUpdate( {_id: user.id});
       var posicion = usuario.mascotas.findIndex(id => id === idMascota);
        usuario.mascotas.splice(posicion, 1);
        usuario.save();
        } catch (error) {
            console.log(error)
        }
    
    
    
    }

module.exports = {
    registrarUsuario,
    iniciarSesion,
    getUsuario,
    addMascota,
    getMascotas,
    uploadAvatar,
    getAvatar,
    buscaMascota,
    deleteMascota
}