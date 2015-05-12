export default {
  'controllers.DescribeController': require('../api/controllers/DescribeController'),
  'controllers.PolicyController': require('../api/controllers/PolicyController'),
  'controllers.UserController': require('../api/controllers/UserController'),
  'controllers.ValidateController': require('../api/controllers/ValidateController'),
  'policies.alwaysAllow': require('../api/policies/alwaysAllow'),
  'policies.alwaysDeny': require('../api/policies/alwaysDeny'),
  'policies.sessionAuth': require('../api/policies/sessionAuth'),
};