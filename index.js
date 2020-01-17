//*VARIABLES/IMPORTS

const express = require('express');
const cors = require('cors');
const server = express();
const db = require('./data/db');

//*SERVER PORT 

server.listen(5000, () => {
  console.log('server listening on port:5000!');
});

//*GLOBAL MIDDLEWARE:

server.use(express.json());
server.use(cors());

//*ENDPOINTS:

//base
server.get('/', (req, res) => {
  res.send('Hello from the server :)');
});

//GET(all users)
server.get('/api/users', (req, res) => {
  
  db.find()
    .then(users => {
      if(users) {
        res.status(200).json(users);
      } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." });
      };
    })
    .catch(err => {
      res.status(500).json({ success: false, err })
    });
});

//GET(specific user by id)
server.get('/api/users/:id', (req, res) => {

  const {id} = req.params;

  db.findById(id)
    .then(user => {
      if(user) {
        res.status(200).json({ 
          success: true, user
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(err => {
      res.status(500).json({ 
        errorMessage: 'The user information could not be retrieved.', 
        err 
      });
    });
});

//POST(create new user)
server.post('/api/users', (req, res) => {

  const newUser = req.body;

  db.insert(newUser)
    .then(user => {
      console.log(newUser);
      if(newUser.name && newUser.bio){
        res.status(201).json(user);
      } else {
        res.status(400).json({
          errorMessage: "Please provide name AND bio for the user."
        });
      }
    })
    .catch(err => {
      res.status(500).json({ 
        errorMessage: "There was an error while saving the user to the database",
        err
      });
    });
});

//PUT(edit existing user)
server.put('/api/users/:id', (req, res) => {

  const { id } = req.params;
  const edits = req.body;

  db.update(id, edits)
    .then(edited => {
      if(edited.name && edited.bio) {
        res.status(200).json({ edited })
      } else if (!edited.name || !edited.bio){
        res.status(400).json({
          success: false,
          errorMessage: "Please provide name and bio for the user"
        });
      }else {
        res.status(404).json({
          success: false,
          errorMessage: "The user with the specified ID does not exist"
        });
      }
    })
    .catch(err => {
      res.status(500).json({ 
        success: false,
        errorMessage: "The user information could not be modified.",
        err 
      });
    });
});

//DELETE(DESTROY user >:D)
server.delete('/api/users/:id', (req, res) => {

  const { id } = req.params;

  db.remove(id)
    .then(removed => {
      if(removed) {
        res.status(204).end();
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        err,
        errorMessage: "The user could not be removed.",
      });
    });
});

//? when conditions aren't met, code still runs. How to stop this?