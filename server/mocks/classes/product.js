'use strict';

module.exports = function(app) {
  const express = require('express');
  let classesProductRouter = express.Router();

  classesProductRouter.get('/', function(req, res) {
    res.send({"result":[{
      "objectId": "ELXX3fXgwP",
      "quantity": 20,
      "lastOrdertime": {
          "__type": "Date",
          "iso": "2018-11-30T23:32:00.000Z"
      },
      "deliveryType": 1,
      "productType": [
          0
      ],
      "farm": {
          "__type": "Pointer",
          "className": "Farm",
          "objectId": "e2Hivo0f82"
      },
      "unitType": 0,
      "maxDistance": 50,
      "pickUpHourStart": "08:32 AM",
      "pickUpHourEnd": "18:32 PM",
      "title": "Garlic",
      "price": 1,
      "descriptionField": "Garlic ",
      "location": {
          "__type": "GeoPoint",
          "latitude": 40.005481599999996,
          "longitude": -75.3004679
      },
      "placeType": 1,
      "locationTitle": "808 Ardmore Ave 808 Ardmore Ave, Ardmore, PA 19003, USA",
      "images": [
          {
              "__type": "File",
              "url": "http://cherrytreemarket.com/parse/files/3f5db4fb851d3ad146476ab003de0f89FARM/31ee0f9c4588558600041100458f1996_chucky%20.jpeg",
              "name": "31ee0f9c4588558600041100458f1996_chucky .jpeg"
          },
          {
              "__type": "File",
              "url": "http://cherrytreemarket.com/parse/files/3f5db4fb851d3ad146476ab003de0f89FARM/d00a3b673df1f40c3e95e664b8bc25a2_chucky%20.jpeg",
              "name": "d00a3b673df1f40c3e95e664b8bc25a2_chucky .jpeg"
          },
          {
              "__type": "File",
              "url": "http://cherrytreemarket.com/parse/files/3f5db4fb851d3ad146476ab003de0f89FARM/2d19e562808eab961248938acd4f31ac_chucky%20.jpeg",
              "name": "2d19e562808eab961248938acd4f31ac_chucky .jpeg"
          }
      ],
      "seller": {
          "__type": "Pointer",
          "className": "_User",
          "objectId": "50G9AoK252"
      },
      "isActive": true,
      "createdAt": "2018-11-12T23:35:38.331Z",
      "updatedAt": "2018-12-11T12:36:41.570Z",
      "link": "https://jpzb3.app.goo.gl/n6Uh9vtAonAEjvVY8",
      "ACL": {
          "*": {
              "read": true
          },
          "50G9AoK252": {
              "read": true,
              "write": true
          }
      }
  }]}).end(200)
  });

  classesProductRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  classesProductRouter.get('/:id', function(req, res) {
    res.send({
      "objectId": "ELXX3fXgwP",
      "quantity": 20,
      "lastOrdertime": {
          "__type": "Date",
          "iso": "2018-11-30T23:32:00.000Z"
      },
      "deliveryType": 1,
      "productType": [
          0
      ],
      "farm": {
          "__type": "Pointer",
          "className": "Farm",
          "objectId": "e2Hivo0f82"
      },
      "unitType": 0,
      "maxDistance": 50,
      "pickUpHourStart": "08:32 AM",
      "pickUpHourEnd": "18:32 PM",
      "title": "Garlic",
      "price": 1,
      "descriptionField": "Garlic ",
      "location": {
          "__type": "GeoPoint",
          "latitude": 40.005481599999996,
          "longitude": -75.3004679
      },
      "placeType": 1,
      "locationTitle": "808 Ardmore Ave 808 Ardmore Ave, Ardmore, PA 19003, USA",
      "images": [
          {
              "__type": "File",
              "url": "http://cherrytreemarket.com/parse/files/3f5db4fb851d3ad146476ab003de0f89FARM/31ee0f9c4588558600041100458f1996_chucky%20.jpeg",
              "name": "31ee0f9c4588558600041100458f1996_chucky .jpeg"
          },
          {
              "__type": "File",
              "url": "http://cherrytreemarket.com/parse/files/3f5db4fb851d3ad146476ab003de0f89FARM/d00a3b673df1f40c3e95e664b8bc25a2_chucky%20.jpeg",
              "name": "d00a3b673df1f40c3e95e664b8bc25a2_chucky .jpeg"
          },
          {
              "__type": "File",
              "url": "http://cherrytreemarket.com/parse/files/3f5db4fb851d3ad146476ab003de0f89FARM/2d19e562808eab961248938acd4f31ac_chucky%20.jpeg",
              "name": "2d19e562808eab961248938acd4f31ac_chucky .jpeg"
          }
      ],
      "seller": {
          "__type": "Pointer",
          "className": "_User",
          "objectId": "50G9AoK252"
      },
      "isActive": true,
      "createdAt": "2018-11-12T23:35:38.331Z",
      "updatedAt": "2018-12-11T12:36:41.570Z",
      "link": "https://jpzb3.app.goo.gl/n6Uh9vtAonAEjvVY8",
      "ACL": {
          "*": {
              "read": true
          },
          "50G9AoK252": {
              "read": true,
              "write": true
          }
      }
  });
  });

  classesProductRouter.put('/:id', function(req, res) {
    res.send({
      'classes/product': {
        id: req.params.id
      }
    });
  });

  classesProductRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/classes-product', require('body-parser').json());
  app.use('/parse/classes/Product', classesProductRouter);
};
