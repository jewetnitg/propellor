/**
 * PolicyController
 *
 * @description :: Server-side logic for managing Policies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
'use strict';

var _ = require('lodash');

module.exports = {
  execute: function execute(req, res) {
    var name;
    var module;

    name = req.param('name');
    module = require('../policies/' + name);

    _.bindAll(res, 'send');

    module(req, res, res.send);
  }
};