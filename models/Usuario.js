// src/models/Usuario.js
class Usuario {
    constructor(id, nombre, correo, telefono, tipo) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.tipo = tipo;
    }
}

module.exports = Usuario;