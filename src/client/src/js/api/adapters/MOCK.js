/*
 * Created by RikHoffbauer on 09/05/15.
 *
 * Adapter for mocking communications with the server
 *
 */

import Adapter from '../../lib/entities/Adapter';
import _ from 'lodash';

const events = {};

class MOCK extends Adapter {

  constructor(options) {
    super(options);

    _.bindAll(this,
      'connect',
      'executeRequest',
      'subscribe',
      'unsubscribe'
    );
  }

  connect(baseUrl) {
    return new Promise((resolve, reject) => {
      this.trigger('ready', this);
      resolve();
    });
  }

  executeRequest(data) {
    return new Promise((resolve, reject) => {

      resolve(
        window.doServerRequest({
          route: data.url,
          method: data.method && data.method.toLowerCase() || 'get'
        })
      );
    });
  }

  subscribe(entity) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  bindSocketListenerForEntity(entity) {

  }

  unsubscribe(entity) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  on(ev, cb) {
    events[ev] = events[ev] || [];
    events[ev].push(cb);
  }

  trigger(ev, data) {
    events[ev] = events[ev] || [];
    for (var i = 0; i < events[ev].length; i++) {
      var eventHandler = events[ev][i];
      eventHandler(data);
    }
  }

}

export default MOCK;
