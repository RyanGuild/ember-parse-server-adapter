import DS from 'ember-data';
import GeoPoint from '../geopoint';
import Parse from 'parse'

/*
 * The file transform handles Parse's custom GeoPoint format. For
 * example a Parse file might come back from the REST API
 * looking like this:
 *
 * "registeredAt": {
 *   "__type": "GeoPoint",
 *   "latitude": 45.2934237432,
 *   "longitude": -17.233242432
 * }
 *
 * This helper deserializes that structure into a special
 * GeoPoint object. This object should not be changed,
 * instead set a new file object to the property.
 *
 * this.store.find('model').then(function(model){
 *   model.get('someGeo'); // -> GeoPoint object
 *   model.get('someGeo.latitude'); // -> someGeo latitude
 *
 *   var geoPoint = new GeoPoint(lat, lon);
 *   model.set('someGeo', geoPoint);
 * });
 *
 * When saving a record, the GeoPoint object
 * is likewise serialized into the Parse REST API format.
 *
 * @class DS.Transforms.GeoPoint
 */
export default DS.Transform.extend({

  deserialize: function( serialized :any) {
    if ( !serialized ) {
      return null;
    }
    console.log(serialized)

    return GeoPoint.create({
      latitude  : serialized.latitude,
      longitude : serialized.longitude
    });
  },

  serialize: function( deserialized :DS.Model) {
    if (!deserialized) {
      return null;
    }
    //@ts-ignore
    return new Parse.GeoPoint(Number.parseFloat(deserialized.get('latitude')),Number.parseFloat(deserialized.get('longitude')))
  }

});
