"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by RikHoffbauer on 12/05/15.
 *
 * alwaysAllow
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any request
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

exports["default"] = function (req, res, next) {
  return next();
};

;
module.exports = exports["default"];