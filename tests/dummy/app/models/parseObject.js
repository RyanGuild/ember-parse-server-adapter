import DS from 'ember-data';

const ParseObject = DS.Model.extend({
  //@ts-ignore
  createdAt: DS.attr('parse-date'),
  //@ts-ignore
  updatedAt: DS.attr('parse-date'),
})

export default ParseObject