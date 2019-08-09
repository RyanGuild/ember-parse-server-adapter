import DS from 'ember-data';
declare const _default: Readonly<typeof DS.Transform> & (new (properties?: object | undefined) => {
    deserialize: (serialized: any) => void;
    serialize: (deserialized: any) => any;
} & DS.Transform) & (new (...args: any[]) => {
    deserialize: (serialized: any) => void;
    serialize: (deserialized: any) => any;
} & DS.Transform);
export default _default;
