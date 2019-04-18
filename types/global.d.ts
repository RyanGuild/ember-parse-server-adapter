import {default as parseAdapter} from 'ember-parse-server-adapter/adapters/application'
import {default as parseSerializer} from 'ember-parse-server-adapter/serializers/application'
// Types for compiled templates
declare module 'ember-parse-server-adapter/templates/*' {
  //@ts-ignore
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}


declare module 'ember-data/types/registries/adapter'{
   export interface AdapterRegistry{
     '-parse': typeof parseAdapter
    }
}
declare module 'ember-data/types/registries/serializer'{
  export interface SerializerRegistry{
    '-parse': typeof parseSerializer
   }
}