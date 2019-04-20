'use strict';

module.exports = function(app) {
  const express = require('express');
  let usersRouter = express.Router();

  usersRouter.get('/', function(req, res) {
    res.send({
      '/users': []
    });
  });

  usersRouter.post('/', function(req, res) {
    const user = {
      "objectId": "bN7yHpL5LD",
      "createdAt": "2019-04-18T01:37:30.327Z",
      "sessionToken": "r:5dbeefe7205b2727242a3e2d93786b86"
    }
    res.status = 201
    res.contentType = 'application/json'
    res.send(user).end(201)
  });

  usersRouter.get('/:id', function(req, res) {
    const user = {
      "username": "test",
      "email": "test@test.test",
      "emailVerified": false,
      "objectId": "AJHmMs0KZ2",
      "createdAt": "2019-04-18T01:37:30.327Z",
      "sessionToken": "r:5dbeefe7205b2727242a3e2d93786b86"
    }
    res.status = 200
    res.contentType = 'application/json'
    res.send(user).end(200)
  });

  usersRouter.put('/:id', function(req, res) {
    res.send({
      '/users': {
        id: req.params.id
      }
    });
  });

  usersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/-users', require('body-parser').json());
  app.use('/parse/users', usersRouter);
};
