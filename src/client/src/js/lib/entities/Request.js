/**
 * Created by RikHoffbauer on 09/05/15.
 */

import _ from 'lodash';

const singletons = {};

class Request {

  constructor(options) {
    singletons[options.entity] = singletons[options.entity] || {};
    if (singletons[options.entity][options.name]) {
      return singletons[options.entity][options.name];
    } else {
      singletons[options.entity][options.name] = this;
    }

    _.extend(this, options);
  }

  execute(data) {
    console.log('do request', this, 'with data', data);
  }

  fillRouteWithPathVariables() {

  }

}

export default Request;
