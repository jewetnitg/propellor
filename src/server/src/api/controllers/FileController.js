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

import fs from 'fs';
import child_process from 'child_process';

const exec = child_process.exec;

function copyToActualUploadDirectory(path, callback) {
  exec('cp ./.tmp/uploads/' + path + ' ../uploads/' + path, (error, stdout, stderr) => {
    if (error) throw error;

    callback();
  });
}

function __makeFileNameArray(files, configKey) {
  return _.chain(files)
    .pluck('fd')
    .map((path) => {
      const match = path.match(/[^\/]+$/g);

      return match && match[0] && ('/uploads/' + configKey + '/' + match[0]);
    })
    .compact()
    .value();
}

function uploadUsingSkipper(req, res, config, configKey) {
  const file = req.file && req.file('file');
  const uploadConfig = {
    dirname: config.dir ? config.dir : ''
  };

  if (config.max_size) {
    uploadConfig.maxBytes = config.max_size * 1024;
  }

  file.upload(uploadConfig, (err, uploadedFiles) => {
    if (err) return res.send(500, err);

    const fileNameArray = __makeFileNameArray(uploadedFiles, configKey);

    copyToActualUploadDirectory(config.dir + '/' + fileNameArray[0].match(/[^\/]+$/g)[0], () => {
      return res.json(fileNameArray);
    });
  });
}

function uploadManually(req, res, config, configKey) {
  const data      = req.param('data');
  const filename  = req.param('filename');

  UploadService.upload(config, filename, data, (err, data) => {
    if (err) return res.send(500, "Something went wrong while uploading the file");
    const fileNameArray = __makeFileNameArray([{fd: data}], configKey);
    return res.json(fileNameArray);
  });
}

export default {

  upload(req, res) {
    const uploaders = sails.config.uploaders;
    const configKey = req.param('config') || uploaders.default || 'file';
    const config = (configKey && uploaders[configKey]);

    if (config) {
      if (config.policies instanceof Array && config.policies.length) {
        PolicyService.executePolicyArray(config.policies, req, res, (data) => {
          // policies passed, upload is allowed
          if (req.isAjax) {
            // use skipper for AJAX and regular HTTP uploads
            uploadUsingSkipper(req, res, config, configKey);
          } else if (req.isSocket) {
            // handle socket uploads manually, skipper doesn't support file uploads through sockets
            uploadManually(req, res, config, configKey);
          }
        }, (data) => {
          // policies didn't pass, upload is not allowed
          res.forbidden(data);
        });
      }
    } else if (file) {
      return res.send(503, "Config not found, no default specified, can't upload.");
    }
  },

  /**
   * UploadController.download()
   *
   * Download a file from the server's disk.
   *
   * TODO: figure out if this is really safe, doesn't look safe to me, can't you just .. your way to private stuff?
   */
  download(req, res) {
    const configKey = req.param('config');
    const uploaders = sails.config.uploaders;
    const config = (configKey && uploaders[configKey]) || uploaders[uploaders.default];

    const configDir = config.dir.replace(/^\//, '').replace(/\/$/, '');
    const path = '../uploads/' + configDir + '/' + req.param('file');

    fs.createReadStream(path)
      .on('error', function (err) {
        if (err.errno == 34) {
          return res.send(404, err);
        } else {
          return res.serverError(err);
        }
      })
      .pipe(res);
  },

  /**
   * removes a file
   */
  remove(req, res) {

  },

  /**
   * replaces a file with another file
   */
  replace(req, res) {

  }



};
