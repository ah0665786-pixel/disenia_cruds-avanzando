const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // ✔ IMPORTANTE

// Login - GET
router.get('/login', (req, res) => {
    res.render('usuarios/login');
});

// Login - POST
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            return res.send('Usuario no encontrado');
        }

        const usuario = rows[0];
        const match = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!match) {
            return res.send('Contraseña incorrecta');
        }

        // Guardar sesión
        req.session.usuario = usuario;
        res.redirect('/usuarios');
    } catch (error) {
        console.error(error);
        res.send('Error al iniciar sesión');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
