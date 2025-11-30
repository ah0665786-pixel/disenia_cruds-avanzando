const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../src/middleware/authMiddleware');

router.use(auth);

// Listar colaboradores
router.get('/', async (req, res) => {
    try {
        const [colaboradores] = await db.query('SELECT * FROM colaboradores');
        res.render('usuarios/colaboradores/list', { colaboradores });
    } catch (err) {
        console.error(err);
        res.send('Error al listar colaboradores');
    }
});

// Crear colaborador - GET
router.get('/create', (req, res) => {
    res.render('usuarios/colaboradores/create');
});

// Crear colaborador - POST
router.post('/create', async (req, res) => {
    const { nombre, especialidad, correo, telefono, disponibilidad } = req.body;
    try {
        await db.query('INSERT INTO colaboradores (nombre, especialidad, correo, telefono, disponibilidad) VALUES (?, ?, ?, ?, ?)',
            [nombre, especialidad, correo, telefono, disponibilidad]);
        res.redirect('/colaboradores');
    } catch (err) {
        console.error(err);
        res.send('Error al crear colaborador');
    }
});

// Editar colaborador - GET
router.get('/edit/:id', async (req, res) => {
    try {
        const [[colaborador]] = await db.query('SELECT * FROM colaboradores WHERE id_colaborador = ?', [req.params.id]);
        res.render('usuarios/colaboradores/edit', { colaborador });
    } catch (err) {
        console.error(err);
        res.send('Error al cargar colaborador');
    }
});

// Editar colaborador - POST
router.post('/edit/:id', async (req, res) => {
    const { nombre, especialidad, correo, telefono, disponibilidad } = req.body;
    try {
        await db.query('UPDATE colaboradores SET nombre=?, especialidad=?, correo=?, telefono=?, disponibilidad=? WHERE id_colaborador=?',
            [nombre, especialidad, correo, telefono, disponibilidad, req.params.id]);
        res.redirect('/colaboradores');
    } catch (err) {
        console.error(err);
        res.send('Error al actualizar colaborador');
    }
});

// Eliminar colaborador
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM colaboradores WHERE id_colaborador = ?', [req.params.id]);
        res.redirect('/colaboradores');
    } catch (err) {
        console.error(err);
        res.send('Error al eliminar colaborador');
    }
});

module.exports = router;
