import initializer from 'ember-parse-server-adapter/initializers/initialize';

export default {
  name: 'ember-parse-server-adapter',

  after: 'ember-data',

  initialize: initializer
};
