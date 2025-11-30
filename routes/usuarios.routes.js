const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../config/db');
// routes/usuarios.routes.js
const auth = require('../src/middleware/authMiddleware');  // 👈 CORRECTO
router.use(auth); // 🔐 Protege todas las rutas



// 🧠 PROTEGER TODAS LAS RUTAS
router.use(auth);

//  Listar usuarios
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM usuarios');
        res.render('usuarios/list', { usuarios: results });
    } catch (err) {
        console.error(err);
        res.send('Error al listar usuarios');
    }
});

// Formulario para agregar usuario
router.get('/create', (req, res) => {
    res.render('usuarios/create');
});

// Guardar usuario (con hash)
router.post('/create', async (req, res) => {
    const { nombre, correo, telefono, contraseña, tipo } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const query = `INSERT INTO usuarios (nombre, correo, telefono, contraseña, tipo)
                       VALUES (?, ?, ?, ?, ?)`;

        await db.query(query, [nombre, correo, telefono, hashedPassword, tipo]);
        res.redirect('/usuarios');
    } catch (err) {
        console.error(err);
        res.send('Error al guardar el usuario');
    }
});

// Editar usuario
router.get('/edit/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [req.params.id]
        );
        res.render('usuarios/edit', { usuario: result[0] });
    } catch (err) {
        console.error(err);
        res.send('Error al cargar usuario');
    }
});

// Guardar edición
router.post('/edit/:id', async (req, res) => {
    const { nombre, correo, telefono, contraseña, tipo } = req.body;

    try {
        let hashedPassword = contraseña;
        if (contraseña && contraseña.length > 0) {
            hashedPassword = await bcrypt.hash(contraseña, 10);
        }

        const query = `
            UPDATE usuarios 
            SET nombre = ?, correo = ?, telefono = ?, contraseña = ?, tipo = ?
            WHERE id_usuario = ?
        `;

        await db.query(query, [
            nombre, correo, telefono, hashedPassword, tipo, req.params.id
        ]);

        res.redirect('/usuarios');
    } catch (err) {
        console.error(err);
        res.send('Error al actualizar usuario');
    }
});

// Eliminar usuario
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id]);
        res.redirect('/usuarios');
    } catch (err) {
        console.error(err);
        res.send('Error al eliminar usuario');
    }
});

module.exports = router;
