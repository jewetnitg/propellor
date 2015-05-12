'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * Created by RikHoffbauer on 12/05/15.
 *
 * alwaysAllow
 *
 * @module      :: Policy
 * @description :: Simple policy to deny any request
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

exports['default'] = function (req, res, next) {
  return res.forbidden('You are not permitted to perform this action.');
};

;
module.exports = exports['default'];