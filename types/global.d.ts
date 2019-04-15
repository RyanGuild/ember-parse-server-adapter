import parseAdapter from 'ember-parse-server-adapter/adapters/application'
import parseSerializer from 'ember-parse-server-adapter/serializers/application'
// Types for compiled templates
declare module 'ember-parse-server-adapter/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'application': parseAdapter
  }
}

declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    '-parse': typeof parseSerializer
  }
}
