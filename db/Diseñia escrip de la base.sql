-- =======================================================
--   BASE DE DATOS: Diseñia
--   Autor: Angel Mauricio Hernandez Ruiz
--   Proyecto: Diseñia - Servicios de Diseño Digital con IA
-- =======================================================

-- 1️⃣ Crear la base de datos
CREATE DATABASE IF NOT EXISTS disenia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE disenia_db;

-- 2️⃣ Tabla: usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    contraseña VARCHAR(255) NOT NULL,
    tipo ENUM('cliente', 'colaborador', 'admin') DEFAULT 'cliente',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ Tabla: productos
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('diseño personalizado', 'plantilla', 'paquete', 'suscripción') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    tiempo_entrega VARCHAR(20),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);

-- 4️⃣ Tabla: pedidos
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_producto INT,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'en_proceso', 'entregado', 'cancelado') DEFAULT 'pendiente',
    requerimientos TEXT,
    enlace_entrega VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE SET NULL
);

-- 5️⃣ Tabla: pagos
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    metodo ENUM('PayPal', 'Stripe', 'MercadoPago', 'Transferencia') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('completado', 'pendiente', 'fallido') DEFAULT 'pendiente',
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);

-- 6️⃣ Tabla: suscripciones
CREATE TABLE suscripciones (
    id_suscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    nombre_plan VARCHAR(50) NOT NULL,
    precio_mensual DECIMAL(10,2) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado ENUM('activa', 'vencida', 'cancelada') DEFAULT 'activa',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- 7️⃣ Tabla: colaboradores
CREATE TABLE colaboradores (
    id_colaborador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(15),
    disponibilidad ENUM('disponible', 'ocupado') DEFAULT 'disponible'
);

-- 8️⃣ Tabla: asignaciones (relación pedidos-colaboradores)
CREATE TABLE asignaciones (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_colaborador INT,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_colaborador) REFERENCES colaboradores(id_colaborador) ON DELETE CASCADE
);

-- 9️⃣ Tabla: feedback (retroalimentación del cliente)
CREATE TABLE feedback (
    id_feedback INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentarios TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);

-- 🔟 Datos iniciales opcionales (puedes modificarlos o quitarlos)
INSERT INTO productos (nombre, descripcion, tipo, precio, tiempo_entrega)
VALUES
('Flyer Promocional', 'Diseño personalizado para promoción de productos o eventos.', 'diseño personalizado', 250.00, '24h'),
('Logotipo Profesional', 'Diseño de logotipo a medida para empresas o creadores.', 'diseño personalizado', 600.00, '48h'),
('Plantilla Redes Sociales', 'Plantilla editable para publicaciones en Instagram o Facebook.', 'plantilla', 150.00, '24h'),
('Suscripción Premium', 'Acceso mensual a diseños ilimitados y soporte prioritario.', 'suscripción', 999.00, 'mensual');

-- ✅ Verificación final
SHOW TABLES;

/* char de 32, telefono, nombre, correo, clave, tipo ¨*/