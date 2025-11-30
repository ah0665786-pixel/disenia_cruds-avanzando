const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../src/middleware/authMiddleware');

router.use(auth);

// Listar suscripciones
router.get('/', async (req, res) => {
    try {
        const [suscripciones] = await db.query(`
            SELECT s.*, u.nombre AS usuario 
            FROM suscripciones s
            JOIN usuarios u ON s.id_usuario = u.id_usuario
        `);
        const [usuarios] = await db.query('SELECT * FROM usuarios');
        res.render('usuarios/suscripciones/list', { suscripciones, usuarios });
    } catch (err) {
        console.error(err);
        res.send('Error al listar suscripciones');
    }
});

// Crear suscripción - GET
router.get('/create', async (req, res) => {
    const [usuarios] = await db.query('SELECT * FROM usuarios');
    res.render('usuarios/suscripciones/create', { usuarios });
});

// Crear suscripción - POST
router.post('/create', async (req, res) => {
    const { id_usuario, nombre_plan, precio_mensual, fecha_inicio, fecha_fin, estado } = req.body;
    try {
        await db.query('INSERT INTO suscripciones (id_usuario, nombre_plan, precio_mensual, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [id_usuario, nombre_plan, precio_mensual, fecha_inicio, fecha_fin, estado]);
        res.redirect('/suscripciones');
    } catch (err) {
        console.error(err);
        res.send('Error al crear suscripción');
    }
});

// Editar suscripción - GET
router.get('/edit/:id', async (req, res) => {
    try {
        const [[suscripcion]] = await db.query('SELECT * FROM suscripciones WHERE id_suscripcion = ?', [req.params.id]);
        const [usuarios] = await db.query('SELECT * FROM usuarios');
        res.render('usuarios/suscripciones/edit', { suscripcion, usuarios });
    } catch (err) {
        console.error(err);
        res.send('Error al cargar suscripción');
    }
});

// Editar suscripción - POST
router.post('/edit/:id', async (req, res) => {
    const { id_usuario, nombre_plan, precio_mensual, fecha_inicio, fecha_fin, estado } = req.body;
    try {
        await db.query('UPDATE suscripciones SET id_usuario=?, nombre_plan=?, precio_mensual=?, fecha_inicio=?, fecha_fin=?, estado=? WHERE id_suscripcion=?',
            [id_usuario, nombre_plan, precio_mensual, fecha_inicio, fecha_fin, estado, req.params.id]);
        res.redirect('/suscripciones');
    } catch (err) {
        console.error(err);
        res.send('Error al actualizar suscripción');
    }
});

// Eliminar suscripción
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM suscripciones WHERE id_suscripcion = ?', [req.params.id]);
        res.redirect('/suscripciones');
    } catch (err) {
        console.error(err);
        res.send('Error al eliminar suscripción');
    }
});

module.exports = router;
