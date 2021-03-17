const express = require('express');
const cors = require('cors');

const { v4: uuidv4, v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers

  const verifyUserExist = users.find(user => user.username === username)

  if (verifyUserExist != undefined) {
    request.user = verifyUserExist
    next()
  } else {
    return response.status(404).json({error: "User does not exists!"})
  }
}

app.post('/users', (request, response) => {

  const {name, username} = request.body

  if (name == undefined || username == undefined ) {

    return response.status(400).json({error: "name ou username are missing!"})
    
  } else {

    const verifyUserExist = users.find(user => user.username === username)

    if (verifyUserExist != undefined) {     

      return response.status(400).json({error: "username already exists!"})

    } else {

      const uuid = uuidv4()

      const newUser = {
        id: uuid,
        name: name,
        username: username,
        todos: []  
      }

      users.push(newUser)
 
      return response.status(201).json(newUser)
    }

  }

});

app.use(checksExistsUserAccount)

app.get('/todos', (request, response) => {
  
  const user = request.user

  response.status(200).json(user.todos)

});

app.post('/todos', (request, response) => {
  
  const {title, deadline} = request.body
  const user = request.user
  const uuid = uuidv4()

  const newTodo = {
    id: uuid,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTodo)
 
  return response.status(201).json(newTodo)

});

app.put('/todos/:id', (request, response) => {
  const id = request.params.id
  const {title, deadline} = request.body
  const user = request.user

  const todo = user.todos.find(todo => todo.id == id)

  if (todo == undefined) {
    return response.status(404).json({error: "Not found"})
  } else {    
    todo.title = title
    todo.deadline = new Date(deadline) 
    return response.status(201).json(todo)
  }
  
});

app.patch('/todos/:id/done', (request, response) => {
  const id = request.params.id
  const user = request.user

  const todo = user.todos.find(todo => todo.id == id)

  if (todo == undefined) {
    return response.status(404).json({error: "Not found"})
  } else {
    todo.done = true
    return response.status(201).json(todo)
  }
  
});

app.delete('/todos/:id', (request, response) => {
  const id = request.params.id
  const user = request.user
  
  const todo = user.todos.find(todo => todo.id = id)

  if (todo == undefined) {
    return response.status(404).json({error: "Not found"})
  } else {
    user.todos.splice(user, 1)
    return response.status(204).json(user.todos)
  }
  
});

module.exports = app;