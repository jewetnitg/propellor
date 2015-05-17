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

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var exec = _child_process2['default'].exec;

function copyToActualUploadDirectory(path, callback) {
  exec('cp ./.tmp/uploads/' + path + ' ../uploads/' + path, function (error, stdout, stderr) {
    if (error) throw error;

    callback();
  });
}

function __makeFileNameArray(files, configKey) {
  return _.chain(files).pluck('fd').map(function (path) {
    var match = path.match(/[^\/]+$/g);

    return match && match[0] && '/uploads/' + configKey + '/' + match[0];
  }).compact().value();
}

function uploadUsingSkipper(req, res, config, configKey) {
  var file = req.file && req.file('file');
  var uploadConfig = {
    dirname: config.dir ? config.dir : ''
  };

  if (config.max_size) {
    uploadConfig.maxBytes = config.max_size * 1024;
  }

  file.upload(uploadConfig, function (err, uploadedFiles) {
    if (err) return res.send(500, err);

    var fileNameArray = __makeFileNameArray(uploadedFiles, configKey);

    copyToActualUploadDirectory(config.dir + '/' + fileNameArray[0].match(/[^\/]+$/g)[0], function () {
      return res.json(fileNameArray);
    });
  });
}

function uploadManually(req, res, config, configKey) {
  var data = req.param('data');
  var filename = req.param('filename');

  UploadService.upload(config, filename, data, function (err, data) {
    if (err) return res.send(500, 'Something went wrong while uploading the file');
    var fileNameArray = __makeFileNameArray([{ fd: data }], configKey);
    return res.json(fileNameArray);
  });
}

exports['default'] = {

  upload: function upload(req, res) {
    var uploaders = sails.config.uploaders;
    var configKey = req.param('config') || uploaders['default'] || 'file';
    var config = configKey && uploaders[configKey];

    if (config) {
      if (config.policies instanceof Array && config.policies.length) {
        PolicyService.executePolicyArray(config.policies, req, res, function (data) {
          // policies passed, upload is allowed
          if (req.isAjax) {
            // use skipper for AJAX and regular HTTP uploads
            uploadUsingSkipper(req, res, config, configKey);
          } else if (req.isSocket) {
            // handle socket uploads manually, skipper doesn't support file uploads through sockets
            uploadManually(req, res, config, configKey);
          }
        }, function (data) {
          // policies didn't pass, upload is not allowed
          res.forbidden(data);
        });
      }
    } else if (file) {
      return res.send(503, 'Config not found, no default specified, can\'t upload.');
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
    var path = '../uploads/' + configDir + '/' + req.param('file');

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
   * replaces a file with another file
   */
  replace: function replace(req, res) {}

};
module.exports = exports['default'];