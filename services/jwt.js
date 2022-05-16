const jwt = require("jsonwebtoken");

const LlaveToken = "fd7d7fs8fd7s987fdsd4sa4ds65a4as7fd89s";

function crearToken(user, expiresIn){
    const {id, email, nombre, telefono } = user;
    const payload = {id, email, nombre, telefono };

    return jwt.sign(payload, LlaveToken, {expiresIn: expiresIn})
}

function decodeToken(token){
    return jwt.decode(token, LlaveToken);
}



module.exports = {
    crearToken,
    decodeToken
}