/**
 * Created by RikHoffbauer on 10/05/15.
 */

import _ from 'lodash';

class Route {

  constructor(route, options) {
    this.route = route;

    _.bindAll(this, 'execute');
    _.extend(this, options);
  }

  execute(...args) {
    console.log('route', this, 'with data', args);
    // start: call policies
    //        success: call controller
    //              success: call view
    //              failure: do nothing
    //        failure: do nothing
    // always: show flash message
  }

}

export default Route;
