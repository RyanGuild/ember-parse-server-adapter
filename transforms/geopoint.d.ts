import DS from 'ember-data';
declare const _default: Readonly<typeof DS.Transform> & (new (properties?: object | undefined) => {
    deserialize: (serialized: {
        latitude: number;
        longitude: number;
    }) => (any & DS.Transform & {
        latitude: number;
        longitude: number;
    }) | null;
    serialize: (deserialized: DS.Model) => {
        __type: string;
        latitude: any;
        longitude: any;
    } | null;
} & DS.Transform) & (new (...args: any[]) => {
    deserialize: (serialized: {
        latitude: number;
        longitude: number;
    }) => (any & DS.Transform & {
        latitude: number;
        longitude: number;
    }) | null;
    serialize: (deserialized: DS.Model) => {
        __type: string;
        latitude: any;
        longitude: any;
    } | null;
} & DS.Transform);
export default _default;
