import { registerDeprecationHandler } from '@ember/debug';
import config from 'ember-get-config';

export function initialize() {
  registerDeprecationHandler((message, options, next) => {
    if (config.environment === 'test') {
      return;
    } else {
      //@ts-ignore
      next();
    }
  });
}

export default { initialize };