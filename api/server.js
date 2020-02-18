const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const apiRouter = require('./api-router');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api', apiRouter);

server.get('/', (req, res) => {
  res.send("It's working!");
})

module.exports = server;