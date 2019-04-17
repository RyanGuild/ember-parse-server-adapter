import parseAdapter from 'ember-parse-server-adapter/adapters/application'
import parseSerializer from 'ember-parse-server-adapter/serializers/application'
// Types for compiled templates
declare module 'ember-parse-server-adapter/templates/*' {
  //@ts-ignore
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
