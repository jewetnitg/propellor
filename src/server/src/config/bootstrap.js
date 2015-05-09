/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
import _ from 'lodash';

export function bootstrap (cb) {
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  const serverDefinition = {
    config: makeConfigObject(sails.config),
    models: makeModelArray(sails.models),
    requests: makeRequestArray(sails),
    policies: makePolicyArray()
  };

  sails.serverDefinition = serverDefinition;

  function makeConfigObject(config) {
    return {
      adapter: "SAILS_IO",
      baseUrl: "http://www.localhost:1337"
    };
  }

  function makeModelArray(_models) {
    return _.map(_models,  (_model) => {
      const model = {
        defaults: {},
        name: _model.globalId,
        entity: _model.globalId
      };

      const typeDefaults = {
        "number": 0,
        "string": "",
        "date": new Date(),
        "boolean": null,
        "enum": [], // TODO: make enum smarter, check enum attribute on model
        "binary": {}, // TODO: ??
        "json": {},
        "object": {}
      };

      _.each(_model.attributes,  (_attribute, key) =>  {
        const value = _attribute.defaultsTo;

        if (typeof value !== 'undefined') {
          model.defaults[key] = value;
        } else if (typeof _attribute.type !== 'undefined' && typeDefaults[_attribute.type]) {
          model.defaults[key] = typeDefaults[_attribute.type];
        }
      });

      // TODO: add requests related to this model

      return model;
    });
  }

  // TODO: requests can be semanticized from config/routes.js and api/controllers/*.js + config/blueprints.js
  function makeRequestArray(sails) {
    const requestFromRoutesConfigFile = semanticizeRoutesConfigObject(sails.config.routes);
    return requestFromRoutesConfigFile;
  }

  function semanticizeRoutesConfigObject(routes) {
    return _.map(routes, semanticizeRoute);
  }

  function semanticizeRoute(routeObject, path) {
    const methodRegex       = /^(\w+)(?=\s+)/g;
    const pathVariableRegex = /\/[:|*]{1}\w+(?=[\/]?)/g;
    const routeRegex        = /\/.+/g;

    const method            = path.match(methodRegex) && path.match(methodRegex)[0];
    const route             = path.match(routeRegex) && path.match(routeRegex)[0];

    let   pathVariables     = path.match(pathVariableRegex) || [];
    let   entity            = "";
    let   name              = "";

    const controller        = typeof routeObject === 'string' ? routeObject : routeObject.controller;

    if (controller) {
      const split = controller.split('.');
      if (split.length === 2) {
        entity  = split[0].replace(/controller/ig, '');
        name    = split[1];
      }
    }

    pathVariables = _.map(pathVariables, (pathVariable) => {
      return pathVariable.replace(/^\/[:|*]{1}/g, '');
    });

    const requestObject = {
      method,
      entity,
      name,
      pathVariables,
      route
    };

    return requestObject;
  }

  function semanticizeControllers(blueprints) {

  }

  function makePolicyArray(sails) {
    return [];
  }

  console.log(JSON.stringify(serverDefinition));
  console.log('----------------------------\n\n\n\n\n');
  console.log(JSON.stringify(sails));
  cb();
};
