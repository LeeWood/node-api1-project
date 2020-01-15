//*VARIABLES

const express = require('express');
const port = 5000;
const server = express();
const db = require('./data/db');

//*DIRECT SERVER 

server.listen(port, () => {
  console.log(`server listening on port:${port}!`)
});

//*GLOBAL MIDDLEWARE:

server.use(express.json());

//*ENDPOINTS:

//base
server.get('/', (req, res) => {
  res.send('Hello from the server :)')
});

//GET(all)

server.get('/users', (req, res) => {
  db.find()
    .then(users => {
      if(users) {
        res.status(200).json(users);
      } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
      };
    })
    .catch(err => {
      res.status(500).json({ success: false, err })
    });
});

//GET(specific)

//POST

//PUT

//DELETE
