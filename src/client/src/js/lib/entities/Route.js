/**
 * Created by RikHoffbauer on 10/05/15.
 */

import _ from 'lodash';

const singletons = {};

class Route {

  constructor(route, options) {
    if (singletons[route]) {
      return singletons[route];
    } else {
      singletons[route] = this;
    }

    this.route = route;

    _.bindAll(this,
      'execute',
      'executePolicies',
      'executeController',
      'executeView',
      'executeFlash',
      'executeRedirect',
      'onControllerPass',
      'onPolicyFail',
      'onPolicyPass'
    );
    _.extend(this, options);
  }

  /**
   * Executes a route 'request'
   *
   * flow is as follows:
   *
   * start: call policies
   *    success: call controller
   *        success: call view
   *        failure: do nothing
   *    failure: do nothing
   * always: show flash message
   *
   * @param args
   */
  execute(...args) {
    console.log('route', this, 'with data', args);
    const pathVariableObject = this.makePathVariableObject(args);

    this.__tmp_args = args || [];
    this.__tmp_pathVariableObject = pathVariableObject || {};

    return this.executePolicies(pathVariableObject)
      .then(this.onPolicyPass, this.onPolicyFail)
      .then(this.onControllerPass);
  }

  /**
   * called when routing and the controller resolved
   * @param data
   * @returns {Promise}
   */
  onControllerPass(data) {
    return new Promise((resolve, reject) => {
      this.executeView(data);
      this.executeFlash(data);
      resolve(data);
    });
  }

  /**
   * called when routing and all policies have passed
   * @param data
   */
  onPolicyPass(data) {
    return this.executeController();
  }

  /**
   * called when trying to route and not all policies pass
   * @param data
   * @returns {Promise}
   */
  onPolicyFail(data) {
    return new Promise((resolve, reject) => {
      this.executeFlash(data);
      this.executeRedirect(data);
      reject(data);
    });
  }

  /**
   * When a route is 'secured' using policies, all policies must be executed before anything happens,
   * if they all pass, the route will continue and the controller will be called
   * returns a promise
   */
  executePolicies(data) {
    return new Promise((resolve, reject) => {
      // TODO: implement, policies available on app.policies, ex. app.policies.isLoggedIn(data)
      resolve();
    });
  }

  /**
   * Converts an array of pathVariables to a hashmap, useful for passing data to the policy
   */
  makePathVariableObject(pathVariableArray) {
    const pathVariableObject = {};

    _.each(pathVariableArray, (value, i) => {
      const pathVariable = this.pathVariables[i];
      if (pathVariable) {
        pathVariableObject[pathVariable] = value;
      }
    });

    return pathVariableObject;
  }

  /**
   * A controller is called when a route has passed policies,
   * it (the controller) collects the data the view of this route needs
   * returns a promise
   */
  executeController() {
    return new Promise((resolve, reject) => {
      const req = this.makeRequestObject();
      const res = this.makeResponseObject(resolve, reject);

      this.controller(req, res);
    });
  }

  makeRequestObject() {
    const requestObject = {
      session: app.session,
      params: this.__tmp_pathVariableObject,
      param: (key) => {
        return this.__tmp_pathVariableObject[key];
      }
    };

    return requestObject;
  }

  /**
   * makes the responseobject that is available to the view,
   * contains 2 attributes, send (resolve) and forbidden (reject)
   *
   * @param resolve
   * @param reject
   * @returns {{send: *, forbidden: *}}
   */
  makeResponseObject(resolve, reject) {
    const responseObject = {
      send: resolve,
      forbidden: reject
    };

    return responseObject;
  }

  /**
   * Once the controller has collected all the data it needs the view is instantiated and fed this data
   */
  executeView(data) {
    console.log('execute view', data);
    //const view = new this.view(data);
    //app.router.setCurrentView(view);
  }

  /**
   * In any case, if defined, a flash message will be shown to the user to affirm the success or failure of routing
   */
  executeFlash(data, failed) {
    console.log('execute flash', data);
    //if (failed && this.flash.unauthorized) {
    //  app.notify.error();
    //} else (this.flash.authorized) {
    //  app.notify.success();
    //}
  }

  /**
   * In the case of a route not resolving and a 'unauthorized' property being specified,
   * the user will be redirected to this route
   */
  executeRedirect(...args) {
    console.log('execute redirect', args);
    if (this.unauthorized) {
      //app.router.redirect(this.unauthorized, {replace: true});
    }
  }

}

export default Route;