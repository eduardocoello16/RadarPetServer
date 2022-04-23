const Mascota = require("../models/mascota");
const UsuarioController = require("../controllers/usuarioController")
async function createMascota(req, res) {
   const mascota = new Mascota();
   const params = req.body;
   mascota.Nombre = params.Nombre;
   mascota.Ubicacion = params.Ubicacion;

   try {
       const mascotaStore = await mascota.save()
        if(!mascotaStore){
            res.status(400).send({msg: "No se ha podído guardar el bicho"});
            
        }else{
            UsuarioController.addMascota(req.user, mascotaStore) 
            res.status(200).send({Mascota: mascotaStore});
        }

   } catch (error) {
       res.status(500).send(error)
   }
}

async function getMascotas(req, res) {
    try {
        const listaMascotas = await Mascota.find().sort({ FechaCreacion: -1})
        if(!listaMascotas){
            res.status(400).send({msg : "Error al obtener las tareas"})
          
        }else{
            res.status(200).send(listaMascotas)
        
        }
    } catch (error) {
        res.status(500).send(error)
    }
  }
  async function getMascotasFromUser(req, res) {
   let mascotas = await UsuarioController.getMascotas(req.user);
    if(!mascotas){
        res.status(400).send({msg : "Error al obtener las tareas"})
    }else{
        var listaMascotas = [];
        for(let i = 0; i < mascotas.length; i++){
            const mascota = await Mascota.findById(mascotas[i]);
            listaMascotas.push(mascota);
        }
        res.status(200).send(listaMascotas)
         
  
    }
   
  }


  
async function getMascota(req, res) {
 const idMascota = req.params.id;

 try {
     const mascota = await Mascota.findById(idMascota)

     if(!mascota){
         res.status(400).send({msg: "no se ha encontrado la tarea"})
     }else{
         res.status(200).send(mascota)
     }
 } catch (error) {
     res.status(500).send(error)
 }
  }

    
async function editMascota(req, res) 
{
    const idMascota = req.params.id;
    const params = req.body;

   
    try {
        const mascota = await Mascota.findByIdAndUpdate(idMascota, params);
   
        if(!mascota){
            res.status(400).send({msg: "no se ha encontrado la tarea"})
        }else{
            res.status(200).send({msg: "Se ha actualizado correctamet"})
        }
    } catch (error) {
        res.status(500).send(error)
    }
}
async function delMascota(req, res) {
    const idMascota = req.params.id;
 

   
    try {
        const mascota = await Mascota.findByIdAndDelete(idMascota);
   
        if(!mascota){
            res.status(400).send({msg: "No se ha encontrado la Mascota"})
        }else{
            res.status(200).send({msg: "Se ha actualizado correctamet"})
        }
    } catch (error) {
        res.status(500).send(error)
    }
     }

module.exports = {
    createMascota,
    getMascotas,
    getMascota,
    editMascota,
    getMascotasFromUser,
    delMascota
};