/**
 * Created by RikHoffbauer on 11/05/15.
 */

import _ from 'lodash';

class Connection {

  constructor(options) {
    _.extend(this, options);
    this.connected = false;
  }

  connect() {
    return this.adapter.connect(this.baseUrl);
  }

  executeRequest(request, data) {
    const method = request.method ? request.method.toLowerCase() : 'get';
    const url = request.fillRouteWithPathVariables(data);

    return this.adapter.executeRequest({
      method,
      url,
      data
    });
  }

  subscribe(entity) {
    return this.adapter.subscribe(entity);
  }

  unsubscribe(entity) {
    return this.adapter.unsubscribe(entity);
  }

  on(...args) {
    return this.adapter.on.apply(this.adapter, args);
  }

}

export default Connection;
