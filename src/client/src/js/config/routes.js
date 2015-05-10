  "use strict";
  // router -> route -> polices -> flash
  //                   authorized    ->    controller -> view
  //                   unauthorized  ->    redirect

export default {
  // options
  'defaultRoute'  : 'home',
  // disable pushState until we figure out how to use it properly
  'pushState'     : false,

  // actual routes
  'home': {
    controller    : 'UserController.home',
    view          : 'HomeView',
    policies      : ['alwaysAllow'],
    flash         : {
      authorized: () => {
        return "Welcome :)";
      }
    },
    unauthorized  : 'login'
  },

  'user/list': {
    controller    : 'UserController',
    view          : 'UserListView', // lets try to make views webcomponents
    policies      : ['isLoggedIn'],
    unauthorized  : 'login',
    flash         : {
      unauthorized: (req) => {
        return "You need to be logged in to see this page";
      }
    }
  },

  'user/details/:id': {
    controller    : 'UserController',
    view          : 'UserDetailsView',
    policies      : ['isLoggedInUserOrAdmin'],
    unauthorized  : 'user/list',
    flash         : {
      unauthorized: (req) => {
        return "You are not allowed to see this page, you need to be an admin or the user you want to see details of.";
      }
    }
  },

  'login': {
    controller  : 'UserController',
    view        : 'LoginView'
  },

  'register': {
    controller  : 'UserController',
    view        : 'RegisterView'
  }

};
