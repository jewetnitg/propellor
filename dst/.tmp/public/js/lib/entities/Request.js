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

  /**
   * uses app.connection to execute itself
   * @param data
   * @returns {Promise.<T>}
   */
  execute(data) {
    return app.connection.executeRequest(this, data)
      .then(this.postRequest);
  }

  /**
   * executed after a request, checks whether the request was restful (autowired)
   * and whether it was a destroy request.
   * if so, it applies the data to the local model array,
   * otherwise it just resolves the data passed in
   * @param data
   * @returns {Promise}
   */
  postRequest(data) {
    return new Promise((resolve) => {
      if (this.restful && this.entity && app.models[this.entity]) {
        if (this.single) {
          data = data instanceof Array ? data[0] : data;
        }

        if (data && this.destroy) {
          resolve(app.models[this.entity].remove(data));
        } else if (data) {
          resolve(app.models[this.entity].add(data));
        }
      } else {
        resolve(data);
      }
    });
  }

  /**
   * replaces the path variables in the route of this request using a hashmap provided in the first argument
   * @param data {Object}
   * @returns {route|*}
   */
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
