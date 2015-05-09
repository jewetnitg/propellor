/**
 * DescribeController
 *
 * @description :: returns the Server Definition in the response,
 * @description :: the client can use this to automate certain tasks because
 * @description :: the response object describes how the client can communicate with the server
 *
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

export default {
  index: function (req, res) {
    res.json(sails.serverDefinition);
  }
};

