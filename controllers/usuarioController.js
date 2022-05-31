const fs = require('fs');
const Mascota = require("../models/mascota");
const path = require('path');
const Usuario = require("../models/ususario");
const bcryptjs = require("bcryptjs");
const jwt = require("../services/jwt");


async function registrarUsuario(req, res) {

    const params = JSON.parse(req.body.datos);


    try {

            let errors = {
                msg: {
                    nombre: "",
                    apellido: "",
                    email: "",
                    password: "",
                    telefono: ""
                }
            }
            let error = false
            console.log(errors)
        if (!params.email) {
           errors.msg.email = "El email es obligatorio"
           error = true
        };
        if (!params.password) {
            errors.msg.password = "La Contraseña es obligatoria pibe!"
            error = true
        };
        const foundEmail = await Usuario.findOne({
            email: params.email.toLowerCase()
        })
        if (foundEmail)  {
            errors.msg.email = "Lo sentimos, ese E-mail ya está en uso"
            error = true
        }
        console.log(errors)
        if(error === true) throw errors;
        const salt = bcryptjs.genSaltSync(10)
        const nuevoUsuario = new Usuario();
        nuevoUsuario.password = await bcryptjs.hash(params.password, salt)
        nuevoUsuario.email = params.email.toLowerCase()
        nuevoUsuario.nombre = params.nombre
        nuevoUsuario.apellido = params.apellido
        nuevoUsuario.telefono = params.telefono
        if (req.files.avatar) {
            const filePath = req.files.avatar.path;
            const fileSplit = filePath.split(process.env.split);
            const fileName = fileSplit[2];
            const extSplit = fileName.split(".");
            if (extSplit[1] != 'png' && extSplit[1] != 'jpg')
            throw { 
                msg: "Extension no valida. Solo .png y .jpg"
            } 
                nuevoUsuario.avatar = fileName;
        } 
            nuevoUsuario.save();
            res.status(200).send({
                msg: "Usuario registrado"
            })



    } catch (errores) {
        console.log(errores)
        res.status(500).send(errores)
    }
}


async function iniciarSesion(req, res) {
    const {
        email,
        password
    } = req.body;
    try {
        const usuario = await Usuario.findOne({
            email
        });
        if (!usuario) throw {
            msg: "Error en el mail o password"
        }
        const passwordSuccess = await bcryptjs.compare(password, usuario.password)
        if (!passwordSuccess) throw {
            msg: "Error en el mail o password"
        }
        res.status(200).send({
            // Para añadir time jwt.createToken(usuario , "1 day || 1 week || 1 month")
            token: jwt.crearToken(usuario, "1 week"),
        })
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}


async function getUsuario(req, res) {
    const usuario = await Usuario.findOne({
        _id: req.user.id
    });
    try {
        const user = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono,
            avatar: usuario.avatar
        }
        res.status(200).send(user)

    } catch (error) {
        res.status(500).send(error)
    }
}

async function updateDatos(req, res) {
    const usuario = await Usuario.findOne({
        _id: req.user.id
    });
    if (!usuario) throw {
        msg: "Error en el mail o password"
    }
    try {
        
    if (req.files.avatar) {
        const filePath = req.files.avatar.path;
        const fileSplit = filePath.split(process.env.split);
        const fileName = fileSplit[2];
        const extSplit = fileName.split('\.');

        
                if (extSplit[1] != 'png' && extSplit[1] != 'jpg')  throw{
                    msg: "Extension no valida. Solo .png y .jpg"
                 }
                    if (fs.existsSync(`./uploads/usuarios/${usuario.avatar}`)) {
                        fs.unlinkSync(`./uploads/usuarios/${usuario.avatar}`);
                    }
                usuario.avatar = fileName; 
    }
    if (req.body.datos) {
        let params = JSON.parse(req.body.datos);

            usuario.nombre = params.nombre;
            usuario.apellido = params.apellido;
            usuario.email = params.email;
            usuario.telefono = params.telefono;

    }
    usuario.save();
    res.status(200).send({
        msg: "Datos actualizados"
    })
} catch (error) {
    res.status(500).send(error)
}
}
async function getAvatar(req, res) {
    try {
        const usuario = await Usuario.findOne({
            _id: req.user.id
        });
        if (!usuario) throw {
            msg: "Error en el mail o password"
        }
        const filePath = `./uploads/usuarios/${usuario.avatar}`;
        fs.stat(filePath, (err, stats) => {
            if (err) {
                res.status(404).send({
                    msg: "No existe el archivo"
                })
            } else {
                res.sendFile(path.resolve(filePath))
            }
        })
    } catch (error) {
        res.status(500).send(error)
    }



}

//Funciones para Mascotas con el usuario 
async function getMascotas(user) {
    const usuario = await Usuario.findOne({
        _id: user.id
    });
    if (!usuario) {
      return null
    } else{
        return usuario.mascotas;
    }
     //Devuelve un array de id de mascotas
}
async function addMascota(user, mascota) {
    //Meter una mascota al usuario 
    try {
        const usuario = await Usuario.findByIdAndUpdate({
            _id: user.id
        });
        usuario.mascotas.push(mascota.id)
        usuario.save();
    } catch (error) {
        console.log(error)
    }
}
async function buscaMascota(user, idMascota) {
    //Meter una mascota al usuario 
    try {
        const usuario = await Usuario.findByIdAndUpdate({
            _id: user.id
        });
        const mascotaEncontrada = usuario.mascotas.find(idMascota => idMascota === idMascota);
        if (!mascotaEncontrada) {
            return null
        } else {
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
        const usuario = await Usuario.findByIdAndUpdate({
            _id: user.id
        });
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
    updateDatos,
    getAvatar,
    buscaMascota,
    deleteMascota
}