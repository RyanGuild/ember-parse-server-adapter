import Resolver from 'ember-resolver';
import config from 'ember-get-config';

const resolver = Resolver.create();

resolver.namespace = {
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix
};

export default resolver;
