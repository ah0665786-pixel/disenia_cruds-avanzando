const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../src/middleware/authMiddleware');

router.use(auth); // 🔐 Protege todas las rutas

// Listar pedidos
router.get('/', async (req, res) => {
    try {
        const [pedidos] = await db.query(`
            SELECT p.id_pedido, u.nombre AS cliente, pr.nombre AS producto, p.fecha_pedido, p.estado
            FROM pedidos p
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN productos pr ON p.id_producto = pr.id_producto
        `);
        res.render('usuarios/pedidos/list', { pedidos });
    } catch (err) {
        console.error(err);
        res.send('Error al listar pedidos');
    }
});

// Formulario agregar pedido
router.get('/create', async (req, res) => {
    try {
        const [usuarios] = await db.query('SELECT id_usuario, nombre FROM usuarios');
        const [productos] = await db.query('SELECT id_producto, nombre FROM productos');
        res.render('usuarios/pedidos/create', { usuarios, productos });
    } catch (err) {
        console.error(err);
        res.send('Error al cargar formulario');
    }
});

// Guardar pedido
router.post('/create', async (req, res) => {
    const { id_usuario, id_producto, requerimientos, estado } = req.body;
    try {
        await db.query('INSERT INTO pedidos (id_usuario, id_producto, requerimientos, estado) VALUES (?, ?, ?, ?)', 
        [id_usuario, id_producto, requerimientos, estado]);
        res.redirect('/pedidos');
    } catch (err) {
        console.error(err);
        res.send('Error al crear pedido');
    }
});

// Editar pedido
router.get('/edit/:id', async (req, res) => {
    try {
        const [[pedido]] = await db.query('SELECT * FROM pedidos WHERE id_pedido = ?', [req.params.id]);
        const [usuarios] = await db.query('SELECT id_usuario, nombre FROM usuarios');
        const [productos] = await db.query('SELECT id_producto, nombre FROM productos');
        res.render('usuarios/pedidos/edit', { pedido, usuarios, productos });
    } catch (err) {
        console.error(err);
        res.send('Error al cargar pedido');
    }
});

// Guardar edición
router.post('/edit/:id', async (req, res) => {
    const { id_usuario, id_producto, requerimientos, estado } = req.body;
    try {
        await db.query('UPDATE pedidos SET id_usuario=?, id_producto=?, requerimientos=?, estado=? WHERE id_pedido=?', 
        [id_usuario, id_producto, requerimientos, estado, req.params.id]);
        res.redirect('/pedidos');
    } catch (err) {
        console.error(err);
        res.send('Error al actualizar pedido');
    }
});

// Eliminar pedido
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM pedidos WHERE id_pedido=?', [req.params.id]);
        res.redirect('/pedidos');
    } catch (err) {
        console.error(err);
        res.send('Error al eliminar pedido');
    }
});

module.exports = router;
