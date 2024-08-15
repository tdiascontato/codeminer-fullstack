// codeminer/api_codeminer/src/app.js
require('dotenv').config();
require('./database');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', routes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
}

module.exports = app;