'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  'controllers.PolicyController': require('../api/controllers/PolicyController'),
  'controllers.UserController': require('../api/controllers/UserController'),
  'controllers.ValidateController': require('../api/controllers/ValidateController'),
  'policies.sessionAuth': require('../api/policies/sessionAuth')
};
module.exports = exports['default'];