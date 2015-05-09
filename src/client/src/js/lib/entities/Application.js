/**
 * Created by RikHoffbauer on 09/05/15.
 */
'use strict';

import _      from 'lodash';
import files  from '../files';
import $      from 'jquery';
import Model  from '../entities/Model';

class Application {

  constructor(options) {
    window.app = this;
    _.extend(this, options);
    _.bindAll(this, 'interpretServerDefinition', 'instantiateModel');

    this.data = {};
    this.models = {};
    this.config = {};

    this.getServerDefinition()
      .then(this.interpretServerDefinition);
  }

  getServerDefinition() {
    return new Promise((resolve) => {
      $.get('/describe', (data) => {
        this.serverDefinition = data;
        resolve(this.serverDefinition);
      },"json");
    });
  }

  interpretServerDefinition(data) {
    console.log(data);
    _.extend(this.config, data.config || {});
    _.each(data.models, this.instantiateModel);
  }

  instantiateModel(model) {
    const name = model.name;
    this.models[name] = new Model(model);
  }

}

export default Application;
