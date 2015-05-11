/**
 * Created by RikHoffbauer on 09/05/15.
 */
'use strict';

import _          from 'lodash';
import files      from '../files';
import $          from 'jquery';
import Model      from './Model';
import Request    from './Request';
import Route      from './Route';
import Controller from './Controller';
import Router     from './Router';

import setDottedKeyOnObject from '../helpers/setDottedKeyOnObject';

let singleton = null;

class Application {

  constructor(options) {
    if (singleton) {
      return singleton;
    } else {
      singleton = this;
    }

    window.app = this;

    const defaults = {
      _files: files,
      routerOptions: {
        routes: {}
      },
      router: null,
      data: {},
      session: {},
      models: {},
      controllers: {},
      services: {},
      config: {},
      policies: {},
      server: {
        _requests: []
      }
    };

    _.extend(this, defaults, options);
    _.bindAll(this,
      'interpretServerDefinition',
      'instantiateModel',
      'instantiateRequest',
      'executeBootstrap',
      'instantiateRoute',
      'instantiateController',
      'instantiateRouter'
    );

    this.files = this.interpretFiles();

    this.getServerDefinition()
      .then(this.interpretServerDefinition)
      .then(this.executeBootstrap)
      .then(this.instantiateRouter);
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

    _.each(files.controllers, this.instantiateController);
    _.each(files.config.routes, this.instantiateRoute);

    return files;
  }

  instantiateRouter() {
    this.routerOptions.routes['*other'] = 'redirectToDefault';
    this.router = new (Router.extend(this.routerOptions));
  }

  instantiateController(controller, key) {
    controller = controller || {};
    controller.prototype.entity = key.replace(/controller$/ig, '');

    this.controllers[key] = new controller({
      entity: controller.prototype.entity
    });

  }

  instantiateRoute(obj, key) {
    if (typeof obj === 'object' && !(obj instanceof Array)) {
      const split = obj.controller.split('.');
      const controller = split[0];
      const controllerMethod = split[1] || 'index';

      // TODO: do the same for view
      obj.controller = this.controllers[controller][controllerMethod];

      const route = new Route(key, obj);

      this.routerOptions.routes[key] = route.execute;
      this.routerOptions.routes[key]._route = route;
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

    // expose requests conveniently for the user,
    // app.server.User.login(data) would GET /user/login body{data} for example
    this.server[entity]       = this.server[entity] || {};
    this.server[entity][name] = request.execute;

    // we want to make policies even easier to access
    if (entity === 'Policy') {
      this.policies[name] = request.execute;
    }

    this.server._requests.push(request);
  }

}

export default Application;
