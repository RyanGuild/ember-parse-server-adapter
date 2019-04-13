import Adapter from '../adapters/application'
import Serializer from '../serializers/application'
import DateTransform from '../transforms/date'
import FileTransform from '../transforms/file'
import GeopointTransform from '../transforms/geopoint'
import ParseUser from '../models/parse-user'
import DS from 'ember-data'

/**
@module initializers
@class  initialize
*/
export default function (container, app) {
  let applicationId = app.get('applicationId')
  let restApiId = app.get('restApiId')
  let parseUrl = app.get('parseUrl')
  let adapter: DS.RESTAdapter = new Adapter(applicationId, restApiId, parseUrl)

  container.register('adapter:-parse', adapter);
  container.register('serializer:-parse', Serializer);
  container.register('transform:parse-date', DateTransform);
  container.register('transform:parse-file', FileTransform);
  container.register('transform:parse-geo-point', GeopointTransform);
  container.register('model:parse-user', ParseUser);
}

