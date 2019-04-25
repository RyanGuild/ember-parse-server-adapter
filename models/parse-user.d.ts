import DS from 'ember-data';
import Ember from 'ember';
declare var ParseUser: Readonly<typeof DS.Model> & (new (properties?: object | undefined) => {
    username: Ember.ComputedProperty<string, string>;
    password: Ember.ComputedProperty<string, string>;
    email: Ember.ComputedProperty<string, string>;
    emailVerified: Ember.ComputedProperty<boolean, boolean>;
    sessionToken: Ember.ComputedProperty<string, string>;
    createdAt: Ember.ComputedProperty<Date, Date>;
    updatedAt: Ember.ComputedProperty<Date, Date>;
} & DS.Model) & (new (...args: any[]) => {
    username: Ember.ComputedProperty<string, string>;
    password: Ember.ComputedProperty<string, string>;
    email: Ember.ComputedProperty<string, string>;
    emailVerified: Ember.ComputedProperty<boolean, boolean>;
    sessionToken: Ember.ComputedProperty<string, string>;
    createdAt: Ember.ComputedProperty<Date, Date>;
    updatedAt: Ember.ComputedProperty<Date, Date>;
} & DS.Model);
export default ParseUser;
