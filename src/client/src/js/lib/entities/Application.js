/**
 * Created by RikHoffbauer on 09/05/15.
 */
'use strict';

import _      from 'lodash';
import files  from '../files';
import $      from 'jquery';
import Model  from '../entities/Model';
import Request  from '../entities/Request';

let singleton = null;

class Application {

  constructor(options) {
    if (singleton) {
      return singleton;
    } else {
      singleton = this;
    }

    window.app = this;
    _.extend(this, options);
    _.bindAll(this, 'interpretServerDefinition', 'instantiateModel', 'instantiateRequest');

    this.data = {};
    this.models = {};
    this.config = {};
    this.server = {};

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
    _.each(data.requests, this.instantiateRequest)
  }

  instantiateModel(model) {
    const name = model.name;
    this.models[name] = new Model(model);
  }

  instantiateRequest(request) {
    const entity  = request.entity;
    const name    = request.name;

    this.server[entity] = this.server[entity] || {};
    this.server[entity][name] = new Request(request);
  }

}

export default Application;
