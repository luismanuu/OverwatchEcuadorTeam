const app = require('./api/index');
const express = require('express');

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor corriendo localmente en http://localhost:${port}`);
});
