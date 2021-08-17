const express = require('express');
const app = express(); 
const morgan = require('morgan');

require('dotenv').config()
require('./config/database.js');

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

app.use('/users', require('./routes/users'));

app.get('/*', (_req, res) => res.send("This is an api server"));

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
