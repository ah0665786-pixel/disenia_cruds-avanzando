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
const usuariosRoutes = require('./src/middleware/routes/usuarios.routes');
const authRoutes = require('./src/middleware/routes/auth.routes'); // ✔ NUEVO

app.use('/usuarios', usuariosRoutes);
app.use('/', authRoutes);  // ✔ IMPORTANTE

// Página principal
app.get('/', (req, res) => {
    res.render('usuarios/login');  // ✔ Ahora debe ir al login
});

// Servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

