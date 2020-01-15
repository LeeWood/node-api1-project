const express = require('express');

const port = 5000;

const server = express();

server.listen(5000, () => {
  console.log('server listening on port 5000!')
});

//*GLOBAL MIDDLEWARE:

server.use(express.json());

//*MIDDLEWARE:




