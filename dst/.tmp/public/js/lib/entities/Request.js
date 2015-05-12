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
    _.bindAll(this, 'execute');
    _.extend(this, options);
  }

  execute(data) {
    console.log('do request', this, 'with data', data);
    return app.connection.executeRequest(this, data);
  }

  fillRouteWithPathVariables(data) {
    let url = this.route;
    _.each(this.pathVariables, (pathVariable) => {
      const val   = typeof data[pathVariable] !== 'undefined' ? data[pathVariable] : '';
      const regex = new RegExp('[:|*]{1}' + pathVariable + '', 'ig');
      url = url.replace(regex, val);
    });
    return url
  }

}

export default Request;
