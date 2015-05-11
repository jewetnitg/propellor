/**
 * Created by RikHoffbauer on 11/05/15.
 */

'use strict';

import Backbone       from 'backbone';
import $              from 'jquery';

Backbone.$ = $;

/**
 * Router class, handles the browser navigation, extends attributes (self) with options passed into constructor,
 * run Router.prototype.startHistory() to make the router start working
 *
 * @param options
 * @type Router
 * @class
 */
class Router extends Backbone.Router {

  /**
   * Start watching for hash change events when the router is instantiated
   */
  initialize() {
    this.startHistory();
  }

  /**
   * start navigation history using Backbone.history.start, using this.root and this.pushState options
   * @type function
   */
  startHistory() {
    Backbone.history.start({
      pushState : typeof this.pushState === 'undefined' ? false : this.pushState,
      root      : this.root
    });
  }


  /**
   * redirect to the default route specified in defaultRoute
   */
  redirectToDefault() {
    if (this.defaultRoute) {
      this.navigate(this.root + this.defaultRoute, {
        trigger: true
      });
    }
  }

  /**
   * remove the current view
   */
  removeCurrentView() {
    if (this.currentView && this.currentView.remove) {
      this.currentView.remove();
    }
  }

  /**
   * set the currentView
   * @param instance
   */
  setCurrentView(instance) {
    this.removeCurrentView();
    this.currentView = instance;
  }

  /**
   * re render the current view
   */
  reRender() {
    if (this.currentView) {
      this.currentView.render();
    }
  }

  reload() {
    return Backbone.history.loadUrl(Backbone.history.fragment);
  }

  navigateTo(route, options) {
    // check if route is current route
    if (route === window.location.hash.replace(/^#/g, '')) {
      // Backbone router way of reloading a route
      return this.reload();
    } else {
      let opts = {
        trigger: true
      };

      _.extend(opts, options || {});
      return this.navigate(route, opts);
    }

  }
}

// some defaults
Router.prototype.defaultRoute = '';
Router.prototype.root = '/';
Router.prototype.pushState = false;


export default Router;
