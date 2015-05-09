"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * DescribeController
 *
 * @description :: returns the Server Definition in the response,
 * @description :: the client can use this to automate certain tasks because
 * @description :: the response object describes how the client can communicate with the server
 *
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

exports["default"] = {
  index: function index(req, res) {
    res.json(sails.serverDefinition);
  }
};
module.exports = exports["default"];