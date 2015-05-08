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

  function makeConfigObject(config) {
    return {};
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

  function makeRequestArray(sails) {
    return [];
  }

  function makePolicyArray(sails) {
    return [];
  }

  console.log(JSON.stringify(serverDefinition));

  cb();
}

;