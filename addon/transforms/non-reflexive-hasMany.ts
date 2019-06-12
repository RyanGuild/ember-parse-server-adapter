import DS from 'ember-data';
import { A }from '@ember/array'

export default DS.Transform.extend({

  deserialize: function( serialized ) {
    let data = A(serialized)
  },

  serialize: function( deserialized ) {
    if ( !deserialized ) {
      return []
    }

    return deserialized
  }

});
