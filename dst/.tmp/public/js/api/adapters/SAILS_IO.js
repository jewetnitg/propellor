/*
 * Created by RikHoffbauer on 09/05/15.
 *
 * Adapter for communicating with sails io
 *
 */

const SAILS_IO = {

  connect() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  },

  doRequest() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  },

  subscribe() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  },

  unsubscribe() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

};

export default SAILS_IO;
