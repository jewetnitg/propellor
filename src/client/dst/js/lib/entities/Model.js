/**
 * Created by RikHoffbauer on 09/05/15.
 */

import _ from 'lodash';

const singletons = {};

class Model {

  constructor(options) {
    if (singletons[options.name]) {
      return singletons[options.name];
    } else {
      singletons[options.name] = this;
    }

    _.bindAll(this,
      'get',
      'add'
    );
    _.extend(this, options);

    this.data = [];

    // expose the model's data on app.data so it's easily accessible
    app.data[this.name] = this.data;
  }

  /**
   * gets a model from the array of models on the client,
   * accepts one argument that can be a string or number if it should get a model by id,
   * and an object if it should get a model by searching
   *
   * if the argument is an array get will be called recursively
   *
   * @param arg
   * @returns {Object|Array|undefined}
   */
  get(arg) {
    if (typeof arg === 'string' || typeof arg === 'number') {
      // argument is an id
      return _.chain(this.data)
        .filter((data) => {
          return data.id == arg;
        })
        .first()
        .value();
    } else if (typeof arg === 'object' && !(arg instanceof Array)) {
      // argument is a model or search object
      if (arg.id) {
        // argument has an id, return single model
        return _.chain(this.data)
          .filter((data) => {
            const matchedProperties = _.map(arg, (_arg, key) => {
              return data[key] == _arg;
            });

            return matchedProperties.indexOf(false) === -1;
          })
          .first()
          .value();
      } else {
        // argument is a search object, return array of matches
        return _.chain(this.data)
          .filter((data) => {
            const matchedProperties = _.map(arg, (_arg, key) => {
              return data[key] == _arg;
            });

            return matchedProperties.indexOf(false) === -1;
          })
          .value();
      }
    } else if (arg instanceof Array) {
      return _.map(arg, this.get);
    }

    return undefined;
  }

  /**
   * Adds an object to the data, if it already exists it merges it
   * TODO:  remove all attributes explicitly it could be that some attribute was removed,
   *        extending doesn't remove anything
   *
   * @returns {Object|Array}
   */
  add(arg) {
    if (arg instanceof Array) {
      return _.map(arg, this.add);
    } else if (typeof arg === 'object') {
      const model = this.get(arg);

      if(model) {
        return _.extend(model, arg);
      } else {
        this.data.push(arg);
        return arg;
      }
    }
  }

}

export default Model;
