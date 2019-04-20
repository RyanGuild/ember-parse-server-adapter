import Application from 'dummy/app';
import config from 'ember-get-config';
import { run } from '@ember/runloop';
import loadInitializers from 'ember-load-initializers'

export default function startApp(attrs) {
  let attributes = Object.assign({}, config.APP);
  attributes.autoboot = true;
  attributes = Object.assign({},attributes, attrs); // use defaults, but you can override;

  return run(() => {
    loadInitializers(application, config.modulePath)
    let application = Application.create(attributes);
    application.setupForTesting()
    application.injectTestHelpers()
    return application;
  });
}
