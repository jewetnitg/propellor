module.exports = {
  'config.bootstrap': require('../../src/js/config/bootstrap'),
  'config.routes': require('../../src/js/config/routes'),
  'config.subsets': require('../../src/js/config/subsets'),
  'adapters.SAILS_IO': require('../../src/js/api/adapters/SAILS_IO'),
  'views.HomeView': require('../../src/js/api/views/HomeView'),
  'services.UserService': require('../../src/js/api/services/UserService'),
  'controllers.UserController': require('../../src/js/api/controllers/UserController')
};