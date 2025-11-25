// src/routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Renderizamos la vista 'index.ejs'
    res.render('index'); 
});

module.exports = router;
