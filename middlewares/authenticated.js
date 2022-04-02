const moment = require("moment")
const jwt = require("../services/jwt")

const LlaveToken = "fd7d7fs8fd7s987fdsd4sa4ds65a4as7fd89s";

function ensureAuth(req, res, next){

    if(!req.headers.authorization){
        res.status(403).send({ msg: "La petición no tiene la key"})
    }
    const token = req.headers.authorization.replace(/['"]+/g,"");
    const payload = jwt.decodeToken(token, LlaveToken);
    try {
      
        if(payload.exp <= moment().unix()){
            return res.status(400).send({msg: "El token ha expirado"})
        }
        
    } catch (error) {
        return res.status(400).send({msg: "token invalid"})
    }

    req.user = payload;
    next();

}

module.exports = {
    ensureAuth
}