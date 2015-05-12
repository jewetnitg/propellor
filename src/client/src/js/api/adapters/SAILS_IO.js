/*
 * Created by RikHoffbauer on 09/05/15.
 *
 * Adapter for communicating with sails io
 *
 */

import Adapter from '../../lib/entities/Adapter';
import _ from 'lodash';

class SAILS_IO extends Adapter {

  constructor(options) {
    super(options);

    _.bindAll(this,
      'connect',
      'bindConnectEventListener',
      'handleSuccessfulConnect',
      'executeRequest',
      'subscribe',
      'unsubscribe'
    );
  }

  /**
   * connects to sails, if connection isn't established within 5 seconds,
   * it rejects
   * @param baseUrl
   * @returns {Promise}
   */
  connect(baseUrl) {
    return new Promise((resolve, reject) => {
      this.bindConnectEventListener(io.sails.connect(baseUrl), baseUrl, resolve);
      this._connectionTimeout = setTimeout(() => {
        reject();
      }, 5000);
    });
  }

  /**
   * listens to the 'on' event on the socket
   * @param raw
   * @param baseUrl
   * @param resolve
   */
  bindConnectEventListener(raw, baseUrl, resolve) {
    raw.on('connect', () => {
      this.handleSuccessfulConnect(raw, baseUrl, resolve);
    });
  }

  /**
   * called when the connection has been established,
   * resolves the connect function
   * @param raw
   * @param baseUrl
   * @param resolve
   */
  handleSuccessfulConnect(raw, baseUrl, resolve) {
    this.connected = true;
    this.raw = raw;
    this.baseUrl = baseUrl;

    clearTimeout(this._connectionTimeout);
    delete this._connectionTimeout;

    resolve();
  }

  /**
   * executes a request using the connected socket
   * @param data
   * @returns {Promise}
   */
  executeRequest(data) {
    console.log('execute request adapter', arguments);
    return new Promise((resolve, reject) => {
      this.raw.request(data, (_data, JWR) => {
        if (JWR.statusCode >= 200 && JWR.statusCode < 400) {
          resolve(_data);
        } else {
          reject(_data);
        }
      });
    });
  }

  subscribe(entity) {
    app.server[entity].findAll().then(() => {
      this.bindSocketListenerForEntity(entity);
      return new Promise((resolve, reject) => {
        resolve();
      });
    });
  }

  bindSocketListenerForEntity(entity) {
    const event = entity.toLowerCase();
    this.on(event, (event) => {
      if (event.verb === 'update' || event.verb === 'created') {
        app.models[entity].add(event.data);
      } else if (event.verb === 'destroyed') {
        app.models[entity].remove(event.id);
      }
    });
  }

  unsubscribe(entity) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  on(...args) {
    return this.raw.on.apply(this.raw, args);
  }

}

export default SAILS_IO;
