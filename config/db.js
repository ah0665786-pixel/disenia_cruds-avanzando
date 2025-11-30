

const mysql = require('mysql2/promise'); // Usamos promesas (más PRO)

// Configuración de conexión
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'disenia_user',
    password: process.env.DB_PASSWORD || 'disenia123',
    database: process.env.DB_NAME || 'disenia_db',
    waitForConnections: true,
    connectionLimit: 10,    // Máximo de conexiones simultáneas
    queueLimit: 0           // 0 = ilimitado
});

// Probar conexión
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos exitosa.');
        connection.release(); // Liberar conexión para no saturar el pool
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
    }
})();

module.exports = pool;
