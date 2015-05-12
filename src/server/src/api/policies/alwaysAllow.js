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
export default function(req, res, next) {
  return next();
};
