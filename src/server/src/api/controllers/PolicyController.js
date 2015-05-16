/**
 * PolicyController
 *
 * @description :: Server-side logic for executing Policies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
'use strict';

import _ from 'lodash';

export default {

	execute: function (req, res) {
    var name = req.param('name');

    _.bindAll(res, 'send');

    PolicyService.executePolicy(name, req, res, res.send);
  }

};
