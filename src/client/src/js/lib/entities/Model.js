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
      'get'
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
      // argument is a model or
      return _.chain(this.data)
        .filter((data) => {
          const matchedProperties = _.map(arg, (_arg, key) => {
            return data[key] == _arg;
          });

          return matchedProperties.indexOf(false) === -1;
        })
        .first()
        .value();
    } else if (arg instanceof Array) {
      return _.map(arg, this.get)
    }

    return undefined;
  }

}

export default Model;
