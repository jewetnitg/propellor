/**
 * Created by RikHoffbauer on 09/05/15.
 */

import _ from 'lodash';

const singletons = {};

const dataTypeHashMap = {
  "int": "number",
  "integer": "number",
  "float": "number",
  "decimal": "number",

  "text": "string",

  "bool": "boolean"
};

// typeCasters[currentDataType][desiredDataType](currentVal)
const typeCasters = {
  "number": {
    "string": (val) => {
      return val + "";
    },

    "boolean": (val) => {
      return !!val;
    },
  },

  "string": {
    "boolean": (val) => {
      return !(!val || val === "0" || val === "false");
    },
    "number": (val) => {
      return parseInt(val, 10);
    }
  },

  "boolean": {
    "string": (val) => {
      return val.toString();
    },
    "number": (val) => {
      return val - 0;
    }
  }
};

class Model {

  constructor(options) {
    if (singletons[options.name]) {
      return singletons[options.name];
    } else {
      singletons[options.name] = this;
    }

    _.bindAll(this,
      'get',
      'add',
      'remove',
      'getIndex',
      'subscribe',
      'unsubscribe',
      'isNew'
    );
    _.extend(this, options);

    this.__observedObjects = [];
    this.data = [];

    // expose the model's data on app.data so it's easily accessible
    app.data[this.name] = this.data;
    this.__bindListeners();
  }

  __bindListeners() {
    if (this.data) {
      this.__bindArrayListener();
      this.__bindObjectListeners();
    }
  }

  __bindArrayListener() {
    Array.observe(this.data, (data) => {
      const model = data.object && data.object[data.index];
      if (model) {
        this.__onDataChange(model);
      }
      this.__bindObjectListeners();
    });
  }

  __bindObjectListeners() {
    _.each(this.data, (data, key) => {
      const model = this.data[key];

      if (this.__observedObjects.indexOf(model) === -1) {
        this.__observedObjects.push(model);
        Object.observe(model, () => {
          this.__onDataChange(model);
        });
      }
    });
  }

  __onDataChange() {
    this.typeCastAttributes(model);
  }

  typeCastAttributes(model) {
    _.each(this.properties, (obj, key) => {
      this.constructor.typeCastAttribute(obj, key, model);
    });
  }

  static typeCastAttribute(obj, key, model) {
    const currentValue = model[key];
    const currentDataType = typeof currentValue;
    let   desiredDataType = obj && (obj.type && obj.type.toLowerCase());

    desiredDataType = dataTypeHashMap[desiredDataType] || desiredDataType;

    if (desiredDataType  && desiredDataType !== currentDataType) {
      const typeCaster = typeCasters[currentDataType] && typeCasters[currentDataType][desiredDataType];

      if (typeCaster) {
        const newValue = typeCaster(currentValue);

        if (newValue !== currentValue) {
          // typecast needed
          model[key] = newValue;
        }
      }
    }
  }

  /**
   * Starts listening to server events using the connection
   */
  subscribe() {
    return app.connection.subscribe(this.entity);
  }

  /**
   * Stops listening to server events
   */
  unsubscribe() {
    return app.connection.unsubscribe(this.entity);
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
            return data.id == arg.id;
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
   * gets the index of a model by id, model or searchobject
   * @param arg
   * @returns {number}
   */
  getIndex(arg) {
    if (arg instanceof Array) {
      return _.map(arg, this.getIndex);
    } else {
      const model = this.get(arg);
      return model ? this.data.indexOf(model) : -1;
    }
  }

  /**
   * Checks whether the model is new by looking at the id property,
   * if it is falsy the model is new
   * @param model
   * @returns {boolean}
   */
  isNew(model) {
    return !model.id;
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
      const model = this.get(arg.id);
      if(model && arg.id) {
        return _.extend(model, arg);
      } else {
        this.data.push(arg);
        return arg;
      }
    }
  }

  /**
   * Removes a model by id, by model object or by search object,
   * if an array is given remove is executed for all items in the array
   *
   * @param arg
   * @returns {undefined}
   */
  remove(arg) {
    if (arg instanceof Array) {
      _.each(arg, this.remove);
    } else if (typeof arg === 'object') {
      const index = this.getIndex(arg);
      this.data.splice(index, 1);
    }
    return undefined;
  }

}

export default Model;
