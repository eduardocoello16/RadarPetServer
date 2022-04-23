const Usuario = require("../models/ususario");
const bcryptjs = require("bcryptjs");
const jwt = require("../services/jwt");


async function registrarUsuario(req, res){
   
    const params = req.body;
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
        nuevoUsuario.avatar = params.avatar
        nuevoUsuario.save();
        res.status(200).send(nuevoUsuario);
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
       res.status(200).send({token: jwt.crearToken(usuario, "12h")})
   } catch (error) {
       res.status(500).send(error)
       console.log("error")
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

async function getMascotas(user) {
  const usuario = await Usuario.findOne( {id: user.id});
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

module.exports = {
    registrarUsuario,
    iniciarSesion,
    getUsuario,
    addMascota,
    getMascotas
}