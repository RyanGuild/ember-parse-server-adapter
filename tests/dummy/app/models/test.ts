import DS from 'ember-data'

export default DS.Model.extend({
    id: DS.attr('id'),
    name: DS.attr('string')
})