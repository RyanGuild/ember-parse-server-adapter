import DS from 'ember-data';
declare const _default: Readonly<typeof DS.Transform> & (new (properties?: object | undefined) => {
    deserialize: (serialized: any) => (any & DS.Transform & {
        name: any;
        url: any;
    }) | null;
    serialize: (deserialized: any) => {
        __type: string;
        name: any;
        url: any;
    } | null;
} & DS.Transform) & (new (...args: any[]) => {
    deserialize: (serialized: any) => (any & DS.Transform & {
        name: any;
        url: any;
    }) | null;
    serialize: (deserialized: any) => {
        __type: string;
        name: any;
        url: any;
    } | null;
} & DS.Transform);
export default _default;
