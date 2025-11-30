const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../src/middleware/authMiddleware');

router.use(auth); // protege todas las rutas

// Listar productos
router.get('/', async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos');
        productos.forEach(p => p.precio = Number(p.precio));
        res.render('usuarios/productos/list', { productos });
    } catch (err) {
        console.error(err);
        res.send('Error al listar productos');
    }
});

// Crear producto
router.get('/create', (req, res) => {
    res.render('usuarios/productos/create');
});

router.post('/create', async (req, res) => {
    const { nombre, descripcion, tipo, precio, tiempo_entrega, estado } = req.body;
    try {
        await db.query(
            'INSERT INTO productos (nombre, descripcion, tipo, precio, tiempo_entrega, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, tipo, precio, tiempo_entrega, estado]
        );
        res.redirect('/productos');
    } catch (err) {
        console.error(err);
        res.send('Error al crear producto');
    }
});

// Editar producto
router.get('/edit/:id', async (req, res) => {
    try {
        const [producto] = await db.query('SELECT * FROM productos WHERE id_producto = ?', [req.params.id]);
        res.render('usuarios/productos/edit', { producto: producto[0] });
    } catch (err) {
        console.error(err);
        res.send('Error al cargar producto');
    }
});

router.post('/edit/:id', async (req, res) => {
    const { nombre, descripcion, tipo, precio, tiempo_entrega, estado } = req.body;
    try {
        await db.query(
            'UPDATE productos SET nombre=?, descripcion=?, tipo=?, precio=?, tiempo_entrega=?, estado=? WHERE id_producto=?',
            [nombre, descripcion, tipo, precio, tiempo_entrega, estado, req.params.id]
        );
        res.redirect('/productos');
    } catch (err) {
        console.error(err);
        res.send('Error al actualizar producto');
    }
});

// Eliminar producto
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM productos WHERE id_producto = ?', [req.params.id]);
        res.redirect('/productos');
    } catch (err) {
        console.error(err);
        res.send('Error al eliminar producto');
    }
});

module.exports = router;
