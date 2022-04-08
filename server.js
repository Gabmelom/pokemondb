require('dotenv').config();
const express = require('express');
const app = express();

app.set("views");
app.set('view engine', 'pug');
app.use(express.static('public'));

