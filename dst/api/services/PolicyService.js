/**
 * Created by RikHoffbauer on 16/05/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rsvp = require('rsvp');

var _rsvp2 = _interopRequireDefault(_rsvp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = {

  __makePolicyPromises: function __makePolicyPromises(policyArray, req, _res) {
    var _this = this;

    return _lodash2['default'].map(policyArray, function (name) {
      return new _rsvp2['default'].Promise(function (resolve, reject) {
        var res = _this.__mockResObj(_res, reject);
        _this.executePolicy(name, req, res, function (arg) {
          resolve(arg);
        });
      });
    });
  },

  __mockResObj: function __mockResObj(res, reject) {
    var mocked = _lodash2['default'].cloneDeep(res);

    mocked.forbidden = function (arg) {
      reject(arg);
    };

    return mocked;
  },

  // TODO use failure function as argument instead of sending response from service
  executePolicy: function executePolicy(name, req, res, success, failure) {
    var module = require('../policies/' + name);
    module(req, res, success);
  },

  executePolicyArray: function executePolicyArray(policyArray, req, res, success, failure) {
    var promises = this.__makePolicyPromises(policyArray, req, res);

    return _rsvp2['default'].all(promises).then(function (data) {
      success(data);
    }, function (data) {
      failure(data);
    });
  }

};
module.exports = exports['default'];