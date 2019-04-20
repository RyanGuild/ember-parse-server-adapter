'use strict';

const fs = require('fs')

module.exports = function(app) {
  const express = require('express');
  let classesFarmRouter = express.Router();

  classesFarmRouter.get('/', function(req, res) {
    var response = {result: [
      {
        "objectId": "gl9YhArZFM",
        "farmName": "Farm Fresh",
        "locationTitle": "Uttara University English Department Sector 4, Dhaka 1230, Bangladesh",
        "location": {
            "__type": "GeoPoint",
            "latitude": 23.865421599999998,
            "longitude": 90.402953
        },
        "createdAt": "2018-05-22T18:28:54.750Z",
        "updatedAt": "2019-03-26T08:57:57.262Z",
        "stripeConnectedId": "acct_1CMt1iFJc7yIqp6c\n",
        "admin": {
            "__type": "Pointer",
            "className": "_User",
            "objectId": "AJHmMs0KZ2"
        },
        "sellCount": 7,
        "ACL": {
            "*": {
                "read": true
            },
            "rWa5ho3JLw": {
                "read": true,
                "write": true
            }
        }
      },
      {
        "objectId": "askjdfba5712",
        "farmName": "Farm Fresh",
        "locationTitle": "Uttara University English Department Sector 4, Dhaka 1230, Bangladesh",
        "location": {
            "__type": "GeoPoint",
            "latitude": 23.865421599999998,
            "longitude": 90.402953
        },
        "createdAt": "2018-05-22T18:28:54.750Z",
        "updatedAt": "2019-03-26T08:57:57.262Z",
        "stripeConnectedId": "acct_1CMt1iFJc7yIqp6c\n",
        "admin": {
            "__type": "Pointer",
            "className": "_User",
            "objectId": "AJHmMs0KZ2"
        },
        "sellCount": 7,
        "ACL": {
            "*": {
                "read": true
            },
            "rWa5ho3JLw": {
                "read": true,
                "write": true
            }
        }
      }
    ]};
    res.status = 200
    res.contentType = 'application/javascript'
    res.send(response)
  });

  classesFarmRouter.post('/', function(req, res) {
    fs.writeFile('out.txt', req.body)
    let data = {
      "stripeConnectedId": "acct_1CMt1iFJc7yIqp6c\n",
      "email": "test@test.com",
      "admin": {
          "__type": "Pointer",
          "className": "_User",
          "objectId": "AJHmMs0KZ2"
      },
      "sellCount": 7,
      "ACL": {
          "*": {
              "read": true
          },
          "rWa5ho3JLw": {
              "read": true,
              "write": true
          }
      }
    }
    res.status = 200
    res.contentType = 'application/json'
    res.send(data);
  });

  classesFarmRouter.post('/:id', function(req, res) {
    fs.writeFile('out.txt', req.body)
    let data = {
      "stripeConnectedId": "acct_1CMt1iFJc7yIqp6c\n",
      "email": "test@test.com",
      "admin": {
          "__type": "Pointer",
          "className": "_User",
          "objectId": "AJHmMs0KZ2"
      },
      "sellCount": 7,
      "ACL": {
          "*": {
              "read": true
          },
          "rWa5ho3JLw": {
              "read": true,
              "write": true
          }
      }
    }
    res.status = 200
    res.contentType = 'application/json'
    res.send(data);
  });

  classesFarmRouter.get('/:id', function(req, res) {
    var response = 
      {
        "objectId": "vDR96Ftn2T",
        "farmName": "Farm Fresh",
        "locationTitle": "Uttara University English Department Sector 4, Dhaka 1230, Bangladesh",
        "location": {
            "__type": "GeoPoint",
            "latitude": 23.865421599999998,
            "longitude": 90.402953
        },
        "createdAt": "2018-05-22T18:28:54.750Z",
        "updatedAt": "2019-03-26T08:57:57.262Z",
        "stripeConnectedId": "acct_1CMt1iFJc7yIqp6c\n",
        "email": "test@test.com",
        "admin": {
            "__type": "Pointer",
            "className": "_User",
            "objectId": "AJHmMs0KZ2"
        },
        "sellCount": 7,
        "ACL": {
            "*": {
                "read": true
            },
            "rWa5ho3JLw": {
                "read": true,
                "write": true
            }
        }
      }
    res.status = 200
    res.contentType = 'application/javascript'
    res.send(response)
  });

  classesFarmRouter.put('/:id', function(req, res) {
    fs.writeFile('out.txt', req.body)
    let data = { 
    "createdAt": "2018-05-22T18:28:54.750Z",
    "updatedAt": "2019-03-26T08:57:57.262Z",
    "stripeConnectedId": "acct_1CMt1iFJc7yIqp6c\n",
    "email": "test@test.com",
    "admin": {
        "__type": "Pointer",
        "className": "_User",
        "objectId": "AJHmMs0KZ2"
    },
    "sellCount": 7,
    "ACL": {
        "*": {
            "read": true
        },
        "rWa5ho3JLw": {
            "read": true,
            "write": true
        }
    }}
    res.status = 200
    res.contentType = 'application/json'
    res.send(data);
  });

  classesFarmRouter.put('/', function(req, res) {
    fs.writeFile('out.txt', req.body)
    let data = {
      "createdAt": "2018-05-22T18:28:54.750Z",
      "updatedAt": "2019-03-26T08:57:57.262Z",
      "stripeConnectedId": "acct_1CMt1iFJc7yIqp6c\n",
      "email": "test@test.com",
      "admin": {
          "__type": "Pointer",
          "className": "_User",
          "objectId": "AJHmMs0KZ2"
      },
      "sellCount": 7,
      "ACL": {
        "*": {
            "read": true
        },
        "rWa5ho3JLw": {
            "read": true,
            "write": true
        }
      }
    }
    res.status = 200
    res.contentType = 'application/json'
    res.send(data);
  });

  classesFarmRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/-classes-farm', require('body-parser').body);
  app.use('/parse/classes/Farm/', classesFarmRouter);
};