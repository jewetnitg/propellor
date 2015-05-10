/**
 * Created by RikHoffbauer on 09/05/15.
 */
'use strict';

import _        from 'lodash';
import files    from '../files';
import $        from 'jquery';
import Model    from '../entities/Model';
import Request  from '../entities/Request';
import Route    from '../entities/Route';

let singleton = null;

// TODO: move to helpers
function setDottedKeyOnObject(keyStr, value, obj) {
  obj = obj || {};

  const split = keyStr.split('.');
  const len   = split.length;

  let i       = 0;

  _.each(split, (key) => {
    if (i === len - 1) {
      obj[key] = value;
    } else {
      obj[key] = obj[key] || {};
      obj = obj[key];
    }
    i++;
  });

  return obj;
}

class Application {

  constructor(options) {
    if (singleton) {
      return singleton;
    } else {
      singleton = this;
    }

    window.app = this;

    _.extend(this, options);
    _.bindAll(this, 'interpretServerDefinition', 'instantiateModel', 'instantiateRequest', 'executeBootstrap', 'instantiateRoute');

    this._files = files;
    //this.router = new Router();
    this.routerOptions = {
      routes: {}
    };
    this.data = {};
    this.models = {};
    this.config = {};
    this.policies = {};
    this.server = {
      _requests: []
    };

    this.files = this.interpretFiles();

    this.getServerDefinition()
      .then(this.interpretServerDefinition)
      .then(this.executeBootstrap);
  }

  executeBootstrap() {
    return new Promise((resolve, reject) => {
      this.files.config.bootstrap(resolve, reject);
    });
  }

  getServerDefinition() {
    return new Promise((resolve) => {
      $.get('/describe', (data) => {
        this.serverDefinition = data;
        resolve(this.serverDefinition);
      },"json");
    });
  }

  interpretFiles() {
    const files = {};

    _.each(this._files, (value, key) => {
      setDottedKeyOnObject(key, value, files);
    });

    _.each(files.config.routes, this.instantiateRoute);

    return files;
  }

  instantiateRoute(obj, key) {
    if (typeof obj === 'object' && !(obj instanceof Array)) {
      const route = new Route(key, obj);
      this.routerOptions.routes[key] = route.execute;
    } else {
      if (key === 'pushState') {
        this.routerOptions.pushState = obj;
      } else if (key === 'defaultRoute') {
        this.routerOptions.defaultRoute = obj;
      }
    }
  }

  interpretServerDefinition(data) {
    _.extend(this.config, data.config || {});

    _.each(data.models, this.instantiateModel);
    _.each(data.requests, this.instantiateRequest);
  }

  instantiateModel(model) {
    const name = model.name;
    this.models[name] = new Model(model);
  }

  instantiateRequest(_request) {
    const entity  = _request.entity;
    const name    = _request.name;
    const request = new Request(_request);

    this.server[entity]       = this.server[entity] || {};
    this.server[entity][name] = request.execute;

    if (entity === 'Policy') {
      this.policies[name] = request.execute;
    }

    this.server._requests.push(request);
  }

}

export default Application;
