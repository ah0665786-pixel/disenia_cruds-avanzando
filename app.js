// app.js
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

// 🧠 Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🧠 Sesión
app.use(session({
    secret: 'mi_secreto', // cámbialo por uno más seguro
    resave: false,
    saveUninitialized: true
}));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 📌 Rutas
const usuariosRoutes = require('./routes/usuarios.routes');
const authRoutes = require('./routes/auth.routes'); 
const adminRoutes = require('./routes/admin.routes');   // 👈 AGRÉGALO
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const suscripcionesRoutes = require('./routes/suscripciones.routes');
const colaboradoresRoutes = require('./routes/colaboradores.routes');

app.use('/colaboradores', colaboradoresRoutes);
app.use('/suscripciones', suscripcionesRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);   // 👈 ACTIVAR RUTA
app.use('/usuarios', express.static(path.join(__dirname, 'src/views/usuarios')));

app.use('/usuarios', usuariosRoutes);  // SOLO UNA VEZ
app.use('/', authRoutes);              // Rutas de login/register

// Página principal: redirige al login
app.get('/', (req, res) => {
    res.render('usuarios/login');
});

// Servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
