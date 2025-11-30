const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../src/middleware/authMiddleware');

// 🔐 Protege todas las rutas de admin
router.use(auth);

// 🔹 Redirigir /admin a /admin/dashboard
router.get('/', (req, res) => {
    res.redirect('/admin/dashboard');
});

// 🔹 Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Contar registros de cada tabla
        const [[{ count: usuarios }]] = await db.query('SELECT COUNT(*) as count FROM usuarios');
        const [[{ count: productos }]] = await db.query('SELECT COUNT(*) as count FROM productos');
        const [[{ count: pedidos }]] = await db.query('SELECT COUNT(*) as count FROM pedidos');
        const [[{ count: suscripciones }]] = await db.query('SELECT COUNT(*) as count FROM suscripciones');
        const [[{ count: colaboradores }]] = await db.query('SELECT COUNT(*) as count FROM colaboradores');

        res.render('usuarios/admin/dashboard', {
            stats: { usuarios, productos, pedidos, suscripciones, colaboradores },
            title: 'Dashboard'
        });
    } catch (err) {
        console.error(err);
        res.send('Error al cargar dashboard');
    }
});

module.exports = router;
