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
    _.bindAll(this,
      'execute',
      'postRequest'
    );
    _.extend(this, options);
  }

  execute(data) {
    console.log('do request', this, 'with data', data);
    return app.connection.executeRequest(this, data).
      then(this.postRequest);
  }

  postRequest(data) {
    return new Promise(resolve => {
      if (this.rest && this.entity && this.app.models[this.entity]) {
        if (data) {
          this.app.models[this.entity].add(data);
        } else if (this.destroy) {
          this.app.models[this.entity].remove(data);
        }
      }
      resolve(data);
    });
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
