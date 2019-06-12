

import DS from 'ember-data'
import parseObject from './parseObject'

const Farm = parseObject.extend({
    farm: DS.belongsTo('farm', {async:true}),
    //@ts-ignore
    location: DS.attr('parse-geo-point'),
    locationTitle: DS.attr('string'),
    //@ts-ignore
    seller: DS.belongsTo('parse-user', {async: true}),
    email: DS.attr('string'),
    placeType: DS.attr('number'),
    maxDistance: DS.attr('number'),
    descriptionField: DS.attr('string'),
    lastOrderTime:DS.attr('date'),
    isActive: DS.attr("boolean"),
    deliveryType: DS.attr('number'),
    quantity: DS.attr('number'),
    pickUpHourStart: DS.attr('string'),
    pickUpHourEnd: DS.attr('string'),
    unitType: DS.attr('number'),
    price:DS.attr('number'),
    link: DS.attr('string'),
    sellCount: DS.attr('number'),
    featuredStripeChargeId: DS.attr('string'),
    featuredUntil: DS.attr('date'),
    isFeatured: DS.attr('boolean')

})

export default Farm
/*
{
    "className": "Product",
    "fields": {
        "objectId": {
            "type": "String"
        },
        "createdAt": {
            "type": "Date"
        },
        "updatedAt": {
            "type": "Date"
        },
        "ACL": {
            "type": "ACL"
        },
        "location": {
            "type": "GeoPoint"
        },
        "seller": {
            "type": "Pointer",
            "targetClass": "_User"
        },
        "title": {
            "type": "String"
        },
        "locationTitle": {
            "type": "String"
        },
        "market": {
            "type": "Pointer",
            "targetClass": "Market"
        },
        "placeType": {
            "type": "Number"
        },
        "images": {
            "type": "Array"
        },
        "maxDistance": {
            "type": "Number"
        },
        "descriptionField": {
            "type": "String"
        },
        "lastOrdertime": {
            "type": "Date"
        },
        "productType": {
            "type": "Array"
        },
        "isActive": {
            "type": "Boolean"
        },
        "deliveryType": {
            "type": "Number"
        },
        "quantity": {
            "type": "Number"
        },
        "farm": {
            "type": "Pointer",
            "targetClass": "Farm"
        },
        "unitType": {
            "type": "Number"
        },
        "pickUpHourStart": {
            "type": "String"
        },
        "pickUpHourEnd": {
            "type": "String"
        },
        "price": {
            "type": "Number"
        },
        "link": {
            "type": "String"
        },
        "sellCount": {
            "type": "Number"
        },
        "featuredUntil": {
            "type": "Date"
        },
        "isFeatured": {
            "type": "Boolean"
        },
        "featuredStripeChargeId": {
            "type": "String"
        }
    }
*/