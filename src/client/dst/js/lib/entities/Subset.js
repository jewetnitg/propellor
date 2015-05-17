/**
 * Created by RikHoffbauer on 17/05/15.
 */

import _ from 'lodash';

const singletons = {};

class Subset {

  /**
   *
   *
   *
   * example options param, entity param would be "User",
   * third param would be "males"
   * {
       where: {
         gender: "male"
       }
     }
   * @param options
   * @param name
   * @param entity
   * @constructor
   */
  constructor(options, entity, name) {
    singletons[entity] = singletons[entity] || {};

    if (singletons[entity][name]) {
      return singletons[entity][name];
    } else {
      singletons[entity][name] = this;
    }

    _.extend(this, options);
    _.bindAll(this,
      '__onDataChange'
    );
    this.data = [];
    this.entity = entity; // User
    this.name = name; // males
    this.instance = app.models[entity];
    this.__observedObjects = [];

    this.__bindListeners();
    this.executeFilters();
  }

  __bindListeners() {
    if (this.instance) {
      this.__bindArrayListener();
      this.__bindObjectListeners();
    }
  }

  __bindArrayListener() {
    Array.observe(this.instance.data, () => {
      this.__onDataChange();
      this.__bindObjectListeners();
    });
  }

  __bindObjectListeners() {
    _.each(this.instance.data, (data, key) => {
      const model = this.instance.data[key];

      if (this.__observedObjects.indexOf(model) === -1) {
        this.__observedObjects.push(model);
        Object.observe(model, this.__onDataChange);
      }
    });
  }

  __onDataChange() {
    this.executeFilters();
  }

  executeFilters() {
    const dataArr = [];

    if (this.where) {
      dataArr.push.apply(dataArr, this.executeWhereFilter());
    }

    if (this.filter) {
      dataArr.push.apply(dataArr, this.executeFilterFilter());
    }

    this.addToArray(dataArr);
    this.removeFromArray(dataArr);
  }

  removeFromArray(models) {
    _.each(this.data, (model, index) => {
      const i = models.indexOf(model);

      if (i === -1) {
        this.data.splice(index, 1);
      }
    });
  }

  addToArray(models) {
    _.each(models, (model) => {
      if (this.data.indexOf(model) === -1) {
        this.data.push(model);
      }
    });
  }

  executeFilterFilter() {
    return _.filter(this.instance.data, this.filter);
  }

  executeWhereFilter() {
    return _.where(this.instance.data, this.where);
  }



}

export default Subset;
