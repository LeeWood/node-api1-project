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
server.get('/api/users', (req, res) => {
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

//TODO vvv
/*make object syntax on returns 
res.status(000).json({
  key: "value",
  key: "value"
})
on returns that have more than one object.
*/

//GET(specific)
server.get('/api/users/:id', (req, res) => {
  const {id} = req.params;

  db.findById(id)
    .then(user => {
      if(user) {
        res.status(200).json({ success: true, user});
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

//POST
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
    //!this is still adding the users even if the error message shows...What if you try the if statement FIRST since it pushes the user no matter what...if(newUser.name && newUser.bio) {db.insert(newUser)...}
    //since the user is defined in the body and not the function...this might work???
    .catch(err => {
      res.status(500).json({ 
        errorMessage: "There was an error while saving the user to the database",
        err
      });
    });
});

//PUT
server.put('/api/users/:id')

//DELETE
