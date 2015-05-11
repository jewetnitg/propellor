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

    _.bindAll(this, 'execute', 'executePolicies', 'executeController', 'executeView', 'executeFlash', 'executeRedirect');
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
    //return this.executePolicies()
    //  .then(this.executeController)
    //  .then(this.executeView)
    //  .then(this.executeFlash)
    //  .catch(this.executeRedirect);
  }

  /**
   * When a route is 'secured' using policies, all policies must be executed before anything happens,
   * if they all pass, the route will continue and the controller will be called
   * returns a promise
   */
  executePolicies() {

  }

  /**
   * Converts an array of pathVariables to a hashmap, useful for passing data to the policy
   */
  makePathVariableObject() {

  }

  /**
   * A controller is called when a route has passed policies,
   * it (the controller) collects the data the view of this route needs
   * returns a promise
   */
  executeController() {

  }

  /**
   * Once the controller has collected all the data it needs the view is instantiated and fed this data
   */
  executeView() {

  }

  /**
   * In any case, if defined, a flash message will be shown to the user to affirm the success or failure of routing
   */
  executeFlash() {

  }

  /**
   * In the case of a route not resolving and a 'unauthorized' property being specified,
   * the user will be redirected to this route
   */
  executeRedirect() {

  }

}

export default Route;
