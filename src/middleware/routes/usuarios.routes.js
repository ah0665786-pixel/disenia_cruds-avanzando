// src/middleware/routes/usuarios.routes.js
const express = require('express');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
const router = express.Router();
const db = require('../dbConnection');  // ✔ Ruta correcta

//  Listar usuarios
router.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) throw err;
        res.render('usuarios/list', { usuarios: results });
    });
});

// Formulario para agregar usuario
router.get('/create', (req, res) => {
    res.render('usuarios/create');
});

//  Guardar usuario (HASHEANDO CONTRASEÑA)
router.post('/create', async (req, res) => {
    const { nombre, correo, telefono, contraseña, tipo } = req.body;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const query = `INSERT INTO usuarios (nombre, correo, telefono, contraseña, tipo)
                   VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [nombre, correo, telefono, hashedPassword, tipo], err => {
        if (err) throw err;
        res.redirect('/usuarios');
    });
});

//  Editar usuario
router.get('/edit/:id', (req, res) => {
    db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('usuarios/edit', { usuario: result[0] });
    });
});

// Guardar edición (SÓLO SI CAMBIAN LA CONTRASEÑA)
router.post('/edit/:id', async (req, res) => {
    const { nombre, correo, telefono, contraseña, tipo } = req.body;

    let hashedPassword = contraseña;

    // Si el usuario escribió una nueva contraseña, la hashamos
    if (contraseña && contraseña.length > 0) {
        hashedPassword = await bcrypt.hash(contraseña, 10);
    }

    const query = `
        UPDATE usuarios 
        SET nombre = ?, correo = ?, telefono = ?, contraseña = ?, tipo = ?
        WHERE id_usuario = ?
    `;

    db.query(query, [nombre, correo, telefono, hashedPassword, tipo, req.params.id], err => {
        if (err) throw err;
        res.redirect('/usuarios');
    });
});

//  Eliminar usuario
router.get('/delete/:id', (req, res) => {
    db.query('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id], err => {
        if (err) throw err;
        res.redirect('/usuarios');
    });
});

module.exports = router;
