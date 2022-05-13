const app = require("./app");
const mongoose = require("mongoose")
//Conexiones
require('dotenv').config();
const port  = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB;


mongoose.connect(
    mongoUri,
    /*
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
    },*/
    (err,res) => {
    try {
        if(err){
            throw err
        }else{
            console.log("La conexion fue satisfactoria")
          
            app.listen(port, () =>{
                console.log("Servidor levantado correctamente en  http://localhost:" + port )
            })
        }
        
    } catch (error) {
        console.error(error)
    }
})

