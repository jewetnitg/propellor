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
import Connection from './Connection';

import setDottedKeyOnObject from '../helpers/setDottedKeyOnObject';

let singleton = null;

/**
 * The Application singleton serves as the glue between the various components of the application,
 * it incorporates interpreting the config files (both server and client), instantiating models,
 * requests, controllers, routes and services.
 * It's there to allow for easy access to your data and classes, and for functionality like running policy checks.
 */
class Application {

  constructor(options) {
    if (singleton) {
      return singleton;
    } else {
      singleton = this;
    }

    window.app = this;

    const defaults = {
      connected: false,
      _files: files,
      routerOptions: {
        routes: {}
      },
      router: null,
      data: {},
      session: {},
      models: {},
      views: {},
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
      'instantiateRouter',
      'connectToServer'
    );

    this.files = this.interpretFiles();

    this.getServerDefinition()
      .then(this.interpretServerDefinition)
      .then(this.connectToServer)
      .then(this.executeBootstrap)
      .then(this.instantiateRouter);
  }

  /**
   * executes the bootstrap function specified by the using in ./config/bootstrap.js
   * @returns {Promise}
   */
  executeBootstrap() {
    return new Promise((resolve, reject) => {
      this.files.config.bootstrap(resolve, reject);
    });
  }

  connectToServer() {
    const adapter = this.files.adapters[this.config.adapter];
    const baseUrl = this.config.baseUrl;

    this.connection = new Connection({
      adapter,
      baseUrl
    });

    return this.connection.connect()
  }

  /**
   * gets the server definition from the server,
   * this tells the client what the server can do and how to talk to it,
   * it will be used to autowire making requests to the server
   *
   * @returns {Promise}
   */
  getServerDefinition() {
    return new Promise((resolve) => {
      $.get('/describe', (data) => {
        this.serverDefinition = data;
        resolve(this.serverDefinition);
      },"json");
    });
  }

  /**
   * Interprets client side files object,
   * it interprets the configs and instantiates all controllers, routes and services
   * @returns {{}}
   */
  interpretFiles() {
    const files = {};

    _.each(this._files, (value, key) => {
      setDottedKeyOnObject(key, value, files);
    });

    this.views = files.views;

    _.each(files.controllers, this.instantiateController);
    _.each(files.config.routes, this.instantiateRoute);

    return files;
  }

  /**
   * Instantiates the router with the router options containing the routes, defaultRoute and pushState property
   */
  instantiateRouter() {
    this.routerOptions.routes['*other'] = 'redirectToDefault';
    this.router = new (Router.extend(this.routerOptions));
  }

  /**
   * instantiates a {Controller} singleton,
   * stores it on app.controllers[key] so app.controllers.UserController for example
   * @param controller
   * @param key
   */
  instantiateController(controller, key) {
    controller = controller || {};
    controller.prototype.entity = key.replace(/controller$/ig, '');

    this.controllers[key] = new controller({
      entity: controller.prototype.entity
    });

  }

  /**
   * makes a route object using an item from the routes config,
   * adds it to the routeOptions so the backbone router will call its
   * execute method.
   *
   * @param obj
   * @param key
   */
  instantiateRoute(obj, key) {
    if (typeof obj === 'object' && !(obj instanceof Array)) {
      const split = obj.controller.split('.');
      const controller = split[0];
      const controllerMethod = split[1] || 'index';

      obj.controller = this.controllers[controller][controllerMethod];
      obj.view = this.views[obj.view];

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

  /**
   * transforms the server definition into something useful for the client
   * @param data
   */
  interpretServerDefinition(data) {
    _.extend(this.config, data.config || {});

    _.each(data.models, this.instantiateModel);
    _.each(data.requests, this.instantiateRequest);
  }

  /**
   * Instantiates a {Model} singleton from a model object (retrieved from the server),
   * stores it on app.models[name], so app.models.User for example, a model is always a collection,
   * there are no instances of single models, models are POJOs
   *
   * @param model
   */
  instantiateModel(model) {
    const name = model.name;
    this.models[name] = new Model(model);
  }

  /**
   * Instantiates a {Request} from a request object (retrieved from the server)
   * and stores the execute method on app.server[entity][name],
   * app.server.User.login for example.
   *
   * @param _request
   */
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
