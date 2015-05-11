/*
 * Created by RikHoffbauer on 09/05/15.
 *
 * Adapter for communicating with sails io
 *
 */

import Adapter from '../../lib/entities/Adapter';


class SAILS_IO extends Adapter {

  connect() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  doRequest() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  subscribe() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  unsubscribe() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

}

export default SAILS_IO;
