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

function __makeFileNameArray(files, configKey) {
  return _.chain(files).pluck('fd').map(function (path) {
    var match = path.match(/[^\/]+$/g);

    return match && match[0] && '/uploads/' + configKey + '/' + match[0];
  }).compact().value();
}

exports['default'] = {

  upload: function upload(req, res) {
    var uploaders = sails.config.uploaders;
    var configKey = req.param('config') || uploaders['default'] || 'file';
    var config = configKey && uploaders[configKey];
    var uploadConfig = {};

    if (config) {
      if (config.dir) {
        uploadConfig.dirname = config.dir;
      }

      if (config.max_size) {
        uploadConfig.maxBytes = config.max_size * 1024;
      }

      if (req.isAjax) {
        var _file = req.file && req.file('file');

        _file.upload(uploadConfig, function (err, uploadedFiles) {
          if (err) return res.send(500, err);
          var fileNameArray = __makeFileNameArray(uploadedFiles, configKey);

          return res.json(fileNameArray);
        });
      } else if (req.isSocket) {
        // handle socket uploads manually, skipper doesn't support file uploads through sockets
        var data = req.param('data');
        var filename = req.param('filename');

        UploadService.upload(config, filename, data, function (err, data) {
          if (err) return res.send(500, 'Something went wrong while uploading the file');

          var fileNameArray = __makeFileNameArray([{ fd: data }], configKey);
          return res.json(fileNameArray);
        });
      }
    } else if (file) {
      return res.send(503, 'Config not found, no default specified');
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