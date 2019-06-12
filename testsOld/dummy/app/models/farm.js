import DS from 'ember-data'
import parseObject from './parseObject'

const Farm = parseObject.extend({
  farmName: DS.attr('string'),
  //@ts-ignore
  location: DS.attr('parse-geo-point'),
  locationTitle: DS.attr('string'),
  stripeConnectedId: DS.attr('string'),
  sellCount: DS.attr('number'),
  //@ts-ignore
  admin: DS.belongsTo('parse-user', {async: true}),
  email: DS.attr('string'),
})

export default Farm
