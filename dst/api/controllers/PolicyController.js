'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * PolicyController
 *
 * @description :: Server-side logic for executing Policies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
'use strict';

exports['default'] = {

  execute: function execute(req, res) {
    var name = req.param('name');

    _lodash2['default'].bindAll(res, 'send');

    PolicyService.executePolicy(name, req, res, res.send);
  }

};
module.exports = exports['default'];