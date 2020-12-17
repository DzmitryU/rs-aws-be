const express = require('express');
require('dotenv').config();

const {handler} = require('./handler');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.all('/*', handler);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});