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
    policies: makePolicyArray()
  };

  serverDefinition.requests = makeRequestArray(sails, serverDefinition.models, serverDefinition.policies);

  sails.serverDefinition = serverDefinition;

  function makeConfigObject(config) {
    return {
      adapter: 'SAILS_IO',
      baseUrl: 'http://localhost:1337'
    };
  }

  function makeModelArray(_models) {
    return _lodash2['default'].map(_models, function (_model) {
      var model = {
        defaults: {},
        requests: [],
        name: _model.globalId,
        entity: _model.globalId
      };

      var typeDefaults = {
        'number': null,
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

      return model;
    });
  }

  function makeRequestArray(sails, modelArray, policyArray) {
    var requestsFromRoutesConfigFile = semanticizeRoutesConfigObject(sails.config.routes, modelArray);
    var requestsFromControllersAndBlueprints = semanticizeControllers(sails.config.blueprints, requestsFromRoutesConfigFile, modelArray);
    var requestsFromPolicies = _lodash2['default'].map(policyArray, createRequestForPolicy);

    return _lodash2['default'].uniq(_lodash2['default'].union(requestsFromRoutesConfigFile, requestsFromControllersAndBlueprints, requestsFromPolicies));
  }

  function createRequestForPolicy(policy) {
    return {
      entity: 'Policy',
      method: 'GET',
      name: policy,
      route: '/policy/' + policy,
      pathVariables: []
    };
  }

  function semanticizeRoutesConfigObject(routes, modelArray) {
    return _lodash2['default'].map(routes, function (routeObject, path) {
      return semanticizeRoute(routeObject, path, modelArray);
    });
  }

  function semanticizeRoute(routeObject, path, modelArray) {
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

    if (entity) {
      var model = findByEntity(modelArray, entity);
      if (model && model.requests) {
        model.requests.push(requestObject);
      }
    }
    return requestObject;
  }

  function makeRestRequestsForModel(entity, requestArray, model, prefix) {
    prefix = prefix || '';

    var requestObjects = [{
      entity: entity,
      method: 'GET',
      name: 'findAll',
      restful: true,
      route: prefix + '/' + entity,
      pathVariables: []
    }, {
      entity: entity,
      method: 'GET',
      name: 'findById',
      restful: true,
      route: prefix + '/' + entity + '/:id',
      pathVariables: ['id']
    }, {
      entity: entity,
      method: 'DELETE',
      name: 'destroy',
      restful: true,
      route: prefix + '/' + entity + '/:id',
      pathVariables: ['id']
    }, {
      entity: entity,
      method: 'POST',
      name: 'create',
      restful: true,
      route: prefix + '/' + entity,
      pathVariables: []
    }, {
      entity: entity,
      method: 'PUT',
      name: 'update',
      restful: true,
      route: prefix + '/' + entity + '/:id',
      pathVariables: ['id']
    }];

    requestArray = requestArray || [];

    requestArray.push.apply(requestArray, requestObjects);
    model.requests.push.apply(model.requests, requestObjects);

    return requestArray;
  }

  function makeValidateRequestForModel(entity, requestArray, model) {
    var requestObject = {
      entity: entity,
      route: '/validate/' + entity,
      method: 'POST',
      pathVariables: [],
      name: 'validate'
    };

    model.requests.push(requestObject);
    requestArray.push(requestObject);

    return requestArray;
  }

  function makeShortcutRequestsForModel(entity, requestArray, model) {
    var requestObjects = [{
      entity: entity,
      method: 'GET',
      name: 'READ',
      restful: true,
      route: '/' + entity + '/find/:id',
      pathVariables: ['id']
    }, {
      entity: entity,
      method: 'POST',
      name: 'CREATE',
      restful: true,
      route: '/' + entity + '/create',
      pathVariables: []
    }, {
      entity: entity,
      method: 'DELETE',
      name: 'DELETE',
      restful: true,
      route: '/' + entity + '/destroy/:id',
      pathVariables: ['id']
    }, {
      entity: entity,
      method: 'PUT',
      name: 'UPDATE',
      restful: true,
      route: '/' + entity + '/update/:id',
      pathVariables: ['id']
    }];

    requestArray = requestArray || [];

    model.requests.push.apply(model.requests, requestObjects);
    requestArray.push.apply(requestArray, requestObjects);

    return requestArray;
  }

  function findByEntity(arr, entity) {
    return _lodash2['default'].filter(arr, function (item) {
      return item.entity.toLowerCase() == entity.toLowerCase();
    })[0];
  }

  function semanticizeControllers(blueprints, explicitRequests, modelArray) {
    var requestArray = [];

    _lodash2['default'].each(_libFiles2['default'], function (val, key) {
      var matches = key.match(/^controllers/ig);

      if (matches && matches.length) {
        (function () {
          var entity = key.replace('controllers.', '').replace(/Controller$/ig, '');
          var methods = _lodash2['default'].methods(val) || [];
          var model = findByEntity(modelArray, entity);

          if (blueprints.rest && model) {
            makeRestRequestsForModel(entity, requestArray, model, blueprints.restPrefix || '');
          }

          if (blueprints.shortcuts && model) {
            makeShortcutRequestsForModel(entity, requestArray, model);
          }

          if (model) {
            makeValidateRequestForModel(entity, requestArray, model);
          }

          _lodash2['default'].each(methods, function (_key) {
            var name = _key;
            var requestObject = undefined;

            if (!_lodash2['default'].findWhere(explicitRequests, { entity: entity, name: name })) {
              if (blueprints.actions !== false) {
                requestObject = makeRequestObjectForAutowiredRequest(blueprints, name, entity);
              }

              if (requestObject) {
                if (model && model.requests) {
                  model.requests.push(requestObject);
                }

                requestArray.push(requestObject);
              }
            }
          });
        })();
      }
    });

    return requestArray;
  }

  function makeRequestObjectForAutowiredRequest(blueprints, name, entity) {
    var requestObject = {
      name: name,
      entity: entity,
      route: (blueprints.prefix || '') + '/' + entity + '/' + (name === 'index' ? '' : name) + '/:id',
      pathVariables: ['id']
    };

    requestObject.entity += blueprints.pluralize ? 's' : '';

    return requestObject;
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

  cb();
}