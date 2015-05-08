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


  function makeConfigObject(config) {
    return {};
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

  function makeRequestArray(sails) {
    return [];
  }

  function makePolicyArray(sails) {
    return [];
  }

  console.log(JSON.stringify(serverDefinition));

  cb();
};
