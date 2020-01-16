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

//GET(all users)
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

//GET(specific user by id)
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
    //!this is still adding the users even if the error message shows...What if you try the if statement FIRST since it pushes the user no matter what...if(newUser.name && newUser.bio) {db.insert(newUser)...}
    //since the user is defined in the body and not the function...this might work???
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
        })
      }else {
        res.status(404).json({
          success: false,
          errorMessage: "The user with the specified ID does not exist"
        })
      }
    })
    .catch(err => {
      res.status(500).json({ 
        success: false,
        errorMessage: "The user information could not be modified." 
      })
    })
})
//!This is doing the same thing where it's still pushing the changes to the array if it fails the requirements and gets an error. Test method on POST operation...then repeat here when successful.

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
        })
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