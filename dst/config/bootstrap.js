'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.bootstrap = bootstrap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _libFiles = require('../lib/files');

var _libFiles2 = _interopRequireDefault(_libFiles);

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
      adapter: 'SAILS_IO',
      baseUrl: 'http://www.localhost:1337'
    };
  }

  function makeModelArray(_models) {
    return _lodash2['default'].map(_models, function (_model) {
      var model = {
        defaults: {},
        name: _model.globalId,
        entity: _model.globalId
      };

      var typeDefaults = {
        'number': 0,
        'string': '',
        'date': new Date(),
        'boolean': null,
        'enum': null, // TODO: make enum smarter, check enum attribute on model
        'binary': {}, // TODO: ??
        'json': {},
        'object': {}
      };

      _lodash2['default'].each(_model.attributes, function (_attribute, key) {
        var value = _attribute.defaultsTo;

        if (typeof value !== 'undefined') {
          model.defaults[key] = value;
        } else if (_attribute.type && typeof typeDefaults[_attribute.type.toLowerCase()] !== 'undefined') {
          model.defaults[key] = typeDefaults[_attribute.type.toLowerCase()];
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
    return _lodash2['default'].map(routes, semanticizeRoute);
  }

  function semanticizeRoute(routeObject, path) {
    var methodRegex = /^(\w+)(?=\s+)/g;
    var pathVariableRegex = /\/[:|*]{1}\w+(?=[\/]?)/g;
    var routeRegex = /\/.+/g;
    var nameFromPathRegex = /^(?:\/)([\w|-]+)/g;

    var method = path.match(methodRegex) && path.match(methodRegex)[0];
    var route = path.match(routeRegex) && path.match(routeRegex)[0];

    var pathVariables = path.match(pathVariableRegex) || [];

    var entity = '';
    var name = '';

    var controller = typeof routeObject === 'string' ? routeObject : routeObject.controller;

    if (controller) {
      var split = controller.split('.');
      if (split.length === 2) {
        entity = split[0].replace(/controller/ig, '');
        name = split[1];
      }
    } else {
      name = route.match(nameFromPathRegex)[0].replace('/', '');
    }

    pathVariables = _lodash2['default'].map(pathVariables, function (pathVariable) {
      return pathVariable.replace(/^\/[:|*]{1}/g, '');
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

  // actions : boolean
  // Whether routes are automatically generated for every action in your controllers
  // (also maps index to /:controller) '/:controller', '/:controller/index', and '/:controller/:action'

  // rest : boolean
  // Automatic REST blueprints enabled?
  // e.g. 'get /:controller/:id?' 'post /:controller' 'put /:controller/:id' 'delete /:controller/:id'

  // shortcuts : boolean
  // These CRUD shortcuts exist for your convenience during development,
  // but you'll want to disable them in production.:
  // '/:controller/find/:id?', '/:controller/create', '/:controller/update/:id', and '/:controller/destroy/:id'

  // prefix : string
  // Optional mount path prefix for blueprints (the automatically bound routes in your controllers) e.g. '/api/v2'

  // restPrefix : string
  // Optional mount path prefix for RESTful blueprints
  // (the automatically bound RESTful routes for your controllers and models)
  // e.g. '/api/v2'. Will be joined to your prefix config.
  // e.g. prefix: '/api' and restPrefix: '/rest', RESTful actions will be available under /api/rest

  // pluralize : boolean
  // Optionally use plural controller names in blueprint routes,
  // e.g. /users for api/controllers/UserController.js.
  function semanticizeControllers(blueprints) {
    _fs2['default'].readdir('api/controllers', function () {});
  }

  function makePolicyArray() {
    var policyArray = [];

    _lodash2['default'].each(_libFiles2['default'], function (val, key) {
      var matches = key.match(/^policies/ig);

      if (matches && matches.length) {
        policyArray.push(key.replace('policies.', ''));
      }
    });

    return policyArray;
  }

  console.log(JSON.stringify(serverDefinition));
  console.log('----------------------------\n\n\n\n\n');
  console.log(JSON.stringify(sails));
  cb();
}

;