export default {
  'controllers.PolicyController': require('../api/controllers/PolicyController'),
  'controllers.UserController': require('../api/controllers/UserController'),
  'controllers.ValidateController': require('../api/controllers/ValidateController'),
  'policies.sessionAuth': require('../api/policies/sessionAuth')
};