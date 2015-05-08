/**
 * Created by RikHoffbauer on 21/04/15.
 */
'use strict';

var _ = require('lodash');

module.exports = {
  execute: function execute(req, res) {
    var Model = sails.models[req.params.name.toLowerCase()];

    Model.validate(req.body, function (err) {
      if (err && err.invalidAttributes) {
        res.status(403);
        res.send(err);
      } else {
        res.status(200);
        res.send();
      }
    });
  }
};