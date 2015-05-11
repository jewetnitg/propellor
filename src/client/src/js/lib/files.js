export default {
  'config.bootstrap': require('../config/bootstrap'),
  'config.routes': require('../config/routes'),
  'adapters.SAILS_IO': require('../api/adapters/SAILS_IO'),
  'adapters.XHR': require('../api/adapters/XHR'),
  'views.HomeView': require('../api/views/HomeView'),
  'controllers.UserController': require('../api/controllers/UserController')
};