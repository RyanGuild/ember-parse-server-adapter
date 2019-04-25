import DS from 'ember-data';
declare const _default: Readonly<typeof DS.Transform> & (new (properties?: object | undefined) => {
    deserialize: (serialized: any) => Date | null;
    serialize: (deserialized: any) => {
        __type: string;
        iso: any;
    } | null;
} & DS.Transform) & (new (...args: any[]) => {
    deserialize: (serialized: any) => Date | null;
    serialize: (deserialized: any) => {
        __type: string;
        iso: any;
    } | null;
} & DS.Transform);
export default _default;
