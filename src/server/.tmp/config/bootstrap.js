"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrap = bootstrap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function bootstrap(cb) {
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var serverDefinition = {
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
    return _lodash2["default"].map(_models, function (_model) {
      var model = {
        defaults: {},
        name: _model.globalId,
        entity: _model.globalId
      };

      var typeDefaults = {
        "number": 0,
        "string": "",
        "date": new Date(),
        "boolean": null,
        "enum": [], // TODO: make enum smarter, check enum attribute on model
        "binary": {}, // TODO: ??
        "json": {},
        "object": {}
      };

      _lodash2["default"].each(_model.attributes, function (_attribute, key) {
        var value = _attribute.defaultsTo;

        if (typeof value !== "undefined") {
          model.defaults[key] = value;
        } else if (typeof _attribute.type !== "undefined" && typeDefaults[_attribute.type]) {
          model.defaults[key] = typeDefaults[_attribute.type];
        }
      });

      // TODO: add requests related to this model

      return model;
    });
  }

  // TODO: requests can be semanticized from config/routes.js and api/controllers/*.js + config/blueprints.js
  function makeRequestArray(sails) {
    var requestFromRoutesConfigFile = semanticizeRoutesConfigObject(sails.config.routes);
    return requestFromRoutesConfigFile;
  }

  function semanticizeRoutesConfigObject(routes) {
    return _lodash2["default"].map(routes, semanticizeRoute);
  }

  function semanticizeRoute(routeObject, path) {
    var methodRegex = /^(\w+)(?=\s+)/g;
    var pathVariableRegex = /\/[:|*]{1}\w+(?=[\/]?)/g;
    var routeRegex = /\/.+/g;

    var method = path.match(methodRegex) && path.match(methodRegex)[0];
    var route = path.match(routeRegex) && path.match(routeRegex)[0];

    var pathVariables = path.match(pathVariableRegex) || [];
    var entity = "";
    var name = "";

    var controller = typeof routeObject === "string" ? routeObject : routeObject.controller;

    if (controller) {
      var split = controller.split(".");
      if (split.length === 2) {
        entity = split[0].replace(/controller/ig, "");
        name = split[1];
      }
    }

    pathVariables = _lodash2["default"].map(pathVariables, function (pathVariable) {
      return pathVariable.replace(/^\/[:|*]{1}/g, "");
    });

    var requestObject = {
      method: method,
      entity: entity,
      name: name,
      pathVariables: pathVariables,
      route: route
    };

    return requestObject;
  }

  function semanticizeControllers(blueprints) {}

  function makePolicyArray(sails) {
    return [];
  }

  console.log(JSON.stringify(serverDefinition));
  console.log("----------------------------\n\n\n\n\n");
  console.log(JSON.stringify(sails));
  cb();
}

;