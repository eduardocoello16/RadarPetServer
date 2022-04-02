const Usuario = require("../models/ususario");
const bcryptjs = require("bcryptjs");
const jwt = require("../services/jwt");


async function registrarUsuario(req, res){
   
    const params = req.body;
    console.log(params)
    
  

    try {
        if(!params.email) throw {msg: "Email Vacio"};
        if(!params.password) throw {msg: "Pass Vacio"};
        const foundEmail = await Usuario.findOne({email : params.email})
        if(foundEmail) throw {msg: "Email en uso"}
        const salt = bcryptjs.genSaltSync(10)
        const nuevoUsuario = new Usuario();
        nuevoUsuario.password = await bcryptjs.hash(params.password, salt)
        nuevoUsuario.email = params.email
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


async function protected(req, res){
  
   console.log(req.user.email)
   try {
    const usuario = await Usuario.findOne( {email: req.user.email});
    if(!usuario) throw {msg: "Error en el mail o password"}
    console.log(usuario)
} catch (error) {
    res.status(500).send(error)
    
}
   
    res.status(200).send({msg: "Contenido protegido"})
}



module.exports = {
    registrarUsuario,
    iniciarSesion,
    protected
}