const axios = require('axios');
const { syncAndSeed } =  require('./db');
require('dotenv').config();

const express = require('express');
const { static } = express;
const path = require('path');


const app = express();

app.use('/dist', static(path.join(__dirname, '../dist')));
app.use('/public', static(path.join(__dirname, '../public')));
app.use('/font-awesome', express.static('node_modules/font-awesome-animation/css/'));

app.use(express.json());

app.use(require('./routes'));
app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, '../src/index.html')));

app.use((error, req, res, next) => res.status(500).send(`There was an error ${error}`));


const init = async()=> {
  await syncAndSeed();
  const port = process.env.PORT || 8080;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();