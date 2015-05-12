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
import fs from 'fs';
import files from '../lib/files';

export function bootstrap (cb) {
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  const serverDefinition = {
    config: makeConfigObject(sails.config),
    models: makeModelArray(sails.models),
    policies: makePolicyArray()
  };

  serverDefinition.requests = makeRequestArray(sails, serverDefinition.models, serverDefinition.policies);

  sails.serverDefinition = serverDefinition;

  function makeConfigObject(config) {
    return {
      adapter: "SAILS_IO",
      baseUrl: "http://localhost:1337"
    };
  }

  function makeModelArray(_models) {
    return _.map(_models,  (_model) => {
      const model = {
        defaults: {},
        requests: [],
        name: _model.globalId,
        entity: _model.globalId
      };

      const typeDefaults = {
        "number": null,
        "string": "",
        "date": new Date(),
        "boolean": null,
        "enum": null, // TODO: make enum smarter, check enum attribute on model
        "binary": {}, // TODO: ??
        "json": {},
        "object": {}
      };

      _.each(_model.attributes,  (_attribute, key) =>  {
        const value = _attribute.defaultsTo;

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
    const requestsFromRoutesConfigFile = semanticizeRoutesConfigObject(sails.config.routes, modelArray);
    const requestsFromControllersAndBlueprints = semanticizeControllers(sails.config.blueprints, requestsFromRoutesConfigFile, modelArray);
    const requestsFromPolicies = _.map(policyArray, createRequestForPolicy);

    return _.uniq(_.union(requestsFromRoutesConfigFile, requestsFromControllersAndBlueprints, requestsFromPolicies));
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
    return _.map(routes, (routeObject, path) => {
      return semanticizeRoute(routeObject, path, modelArray);
    });
  }

  function semanticizeRoute(routeObject, path, modelArray) {
    const methodRegex       = /^(\w+)(?=\s+)/g;
    const pathVariableRegex = /\/[:|*]{1}\w+(?=[\/]?)/g;
    const routeRegex        = /\/.+/g;
    const nameFromPathRegex = /^(?:\/)([\w|-]+)/g;

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
    } else {
      name = route.match(nameFromPathRegex)[0].replace('/', '');
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

    if (entity) {
      const model             = findByEntity(modelArray, entity);
      if (model && model.requests) {
        model.requests.push(requestObject);
      }
    }
    return requestObject;
  }

  function makeRestRequestsForModel (entity, requestArray, model, prefix) {
    prefix = prefix || "";

    const requestObjects = [
      {
        entity,
        method: 'GET',
        name: 'findAll',
        route: prefix + '/' + entity,
        pathVariables: []
      },
      {
        entity,
        method: 'GET',
        name: 'findById',
        route: prefix +'/' + entity + '/:id',
        pathVariables: ['id']
      },
      {
        entity,
        method: 'DELETE',
        name: 'destroy',
        route: prefix +'/' + entity + '/:id',
        pathVariables: ['id']
      },
      {
        entity,
        method: 'POST',
        name: 'create',
        route: prefix +'/' + entity,
        pathVariables: []
      },
      {
        entity,
        method: 'PUT',
        name: 'update',
        route: prefix +'/' + entity + '/:id',
        pathVariables: ['id']
      }
    ];

    requestArray = requestArray || [];

    requestArray.push.apply(requestArray, requestObjects);
    model.requests.push.apply(model.requests, requestObjects);

    return requestArray;
  }

  function makeValidateRequestForModel(entity, requestArray, model) {
    const requestObject = {
      entity,
      route: '/validate/' + entity,
      method: 'POST',
      pathVariables: [],
      name: 'validate'
    };

    model.requests.push(requestObject);
    requestArray.push(requestObject);

    return requestArray;
  }

  function makeShortcutRequestsForModel (entity, requestArray, model) {
    const requestObjects = [
      {
        entity,
        method: 'GET',
        name: 'READ',
        route: '/' + entity + '/find/:id',
        pathVariables: ['id']
      },
      {
        entity,
        method: 'POST',
        name: 'CREATE',
        route: '/' + entity + '/create',
        pathVariables: []
      },
      {
        entity,
        method: 'DELETE',
        name: 'DELETE',
        route: '/' + entity + '/destroy/:id',
        pathVariables: ['id']
      },
      {
        entity,
        method: 'PUT',
        name: 'UPDATE',
        route: '/' + entity + '/update/:id',
        pathVariables: ['id']
      }
    ];

    requestArray = requestArray || [];

    model.requests.push.apply(model.requests, requestObjects);
    requestArray.push.apply(requestArray, requestObjects);

    return requestArray;
  }

  function findByEntity(arr, entity) {
    return _.filter(arr, (item) => {
      return item.entity.toLowerCase() == entity.toLowerCase();
    })[0];
  }

  function semanticizeControllers(blueprints, explicitRequests, modelArray) {
    const requestArray = [];

    _.each(files, (val, key) => {
      let matches = key.match(/^controllers/ig);

      if (matches && matches.length) {
        const entity  = key.replace('controllers.', '').replace(/Controller$/ig, '');
        const methods = _.methods(val) || [];
        const model = findByEntity(modelArray, entity);

        if (blueprints.rest && model) {
          makeRestRequestsForModel(entity, requestArray, model, blueprints.restPrefix || "");
        }

        if (blueprints.shortcuts && model) {
          makeShortcutRequestsForModel(entity, requestArray, model);
        }

        if (model) {
          makeValidateRequestForModel(entity, requestArray, model);
        }

        _.each(methods, (_key) => {
          const name          = _key;
          let requestObject;

          if (!_.findWhere(explicitRequests, {entity: entity, name: name})) {
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

      }
    });

    return requestArray;
  }

  function makeRequestObjectForAutowiredRequest(blueprints, name, entity) {
    const requestObject = {
      name,
      entity,
      route: (blueprints.prefix || '') + '/' + entity + '/' + (name === 'index' ? '' : name) + '/:id',
      pathVariables: ['id']
    };

    requestObject.entity += blueprints.pluralize ? 's' : '';

    return requestObject;
  }

  function makePolicyArray() {
    const policyArray = [];

    _.each(files, (val, key) => {
      let matches = key.match(/^policies/ig);

      if (matches && matches.length) {
        policyArray.push(key.replace('policies.', ''));
      }
    });

    return policyArray;
  }

  cb();
}
