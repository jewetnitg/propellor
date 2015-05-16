/**
 * Created by RikHoffbauer on 16/05/15.
 */

import RSVP from 'rsvp';
import _ from 'lodash';

export default {

  __makePolicyPromises(policyArray, req, _res) {
    return _.map(policyArray, (name) => {
      return new RSVP.Promise((resolve, reject) => {
        const res = this.__mockResObj(_res, reject);
        this.executePolicy(name, req, res, (arg) => {
          resolve(arg);
        });
      });
    });
  },

  __mockResObj(res, reject) {
    const mocked = _.cloneDeep(res);

    mocked.forbidden = (arg) => {
      reject(arg);
    };

    return mocked;
  },

  // TODO use failure function as argument instead of sending response from service
  executePolicy(name, req, res, success, failure) {
    var module = require('../policies/' + name);
    module(req, res, success);
  },

  executePolicyArray(policyArray, req, res, success, failure) {
    const promises = this.__makePolicyPromises(policyArray, req, res);

    return RSVP
      .all(promises)
      .then(
        (data) => {
          success(data);
        },
        (data) => {
          failure(data);
        }
      );
  }

}
