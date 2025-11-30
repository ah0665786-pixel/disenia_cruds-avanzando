const db = require('../config/db');

const Usuarios = {
    // READ: obtener todos
    getAll: (callback) => {
        db.query('SELECT * FROM usuarios', callback);
    },

    // READ: obtener uno por ID
    getById: (id, callback) => {
        db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], callback);
    },

    // CREATE: agregar usuario
    create: (data, callback) => {
        db.query('INSERT INTO usuarios SET ?', data, callback);
    },

    // UPDATE: editar usuario
    update: (id, data, callback) => {
        db.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [data, id], callback);
    },

    // DELETE: eliminar usuario
    delete: (id, callback) => {
        db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], callback);
    }
};

module.exports = Usuarios;
