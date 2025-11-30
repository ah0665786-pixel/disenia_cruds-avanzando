const Usuarios = require('../models/usuarios.model');

exports.getUsuarios = (req, res) => {
    Usuarios.getAll((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getUsuarioById = (req, res) => {
    Usuarios.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results[0]);
    });
};

exports.createUsuario = (req, res) => {
    Usuarios.create(req.body, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Usuario agregado', id: results.insertId });
    });
};

exports.updateUsuario = (req, res) => {
    Usuarios.update(req.params.id, req.body, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Usuario actualizado' });
    });
};

exports.deleteUsuario = (req, res) => {
    Usuarios.delete(req.params.id, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Usuario eliminado' });
    });
};
