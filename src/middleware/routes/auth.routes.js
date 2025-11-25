const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../dbConnection');

// 📌 Login (mostrar form)
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// 📌 Procesar login
router.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;
    
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.send('Usuario NO encontrado');

        // Comparar contraseña
        const validPassword = await bcrypt.compare(contraseña, results[0].contraseña);

        if (!validPassword) return res.send('Contraseña incorrecta');

        req.session.usuario = results[0]; // 🔐 Guardamos sesión
        res.redirect('/usuarios');
    });
});

// 📌 Cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
