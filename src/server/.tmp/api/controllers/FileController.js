/**
 * Created by RikHoffbauer on 13/05/15.
 *
 * Controller for handling all file uploads,
 *
 * usage:
 * POST /upload           will use default config
 * POST /upload/:config   will use specified config with fallback to default
 *
 * TODO: execute policies specified in config
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

exports['default'] = {

  upload: function upload(req, res) {
    var configKey = req.param('config');
    var uploaders = sails.config.uploaders;
    var config = configKey && uploaders[configKey] || uploaders[uploaders['default']];
    var file = req.file('file');
    var uploadConfig = {};

    if (config && file) {
      if (config.dir) {
        uploadConfig.dirname = config.dir;
      }

      if (config.max_size) {
        uploadConfig.maxBytes = config.max_size * 1024;
      }

      file.upload(uploadConfig, function (err, uploadedFiles) {
        if (err) return res.send(500, err);
        var fileNameArray = _.chain(uploadedFiles).pluck('fd').map(function (path) {
          var match = path.match(/[^\/]+$/g);

          return match && match[0] && '/uploads/' + configKey + '/' + match[0];
        }).compact().value();

        return res.json(fileNameArray);
      });
    } else if (file) {
      return res.send(503, 'Config not found, no default specified');
    } else {
      return res.send(422, 'No file specified');
    }
  },

  /**
   * UploadController.download()
   *
   * Download a file from the server's disk.
   *
   * TODO: figure out if this is really safe, doesn't look safe to me, can't you just .. your way to private stuff?
   */
  download: function download(req, res) {
    var configKey = req.param('config');
    var uploaders = sails.config.uploaders;
    var config = configKey && uploaders[configKey] || uploaders[uploaders['default']];

    var configDir = config.dir.replace(/^\//, '').replace(/\/$/, '');
    var path = './.tmp/uploads/' + configDir + '/' + req.param('file');

    _fs2['default'].createReadStream(path).on('error', function (err) {
      if (err.errno == 34) {
        return res.send(404, err);
      } else {
        return res.serverError(err);
      }
    }).pipe(res);
  },

  /**
   * removes a file
   */
  remove: function remove(req, res) {},

  /**
   * replaces a files with another file
   */
  replace: function replace(req, res) {}

};
module.exports = exports['default'];