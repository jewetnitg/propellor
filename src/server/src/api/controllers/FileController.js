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

export default {

  upload(req, res) {
    const configKey = req.param('config');
    const uploaders = sails.config.uploaders;
    const config = (configKey && uploaders[configKey]) || uploaders[uploaders.default];
    const file = req.file('file');
    const uploadConfig = {};

    if (config && file) {
      if (config.dir) {
        uploadConfig.dirname = config.dir;
      }

      if (config.max_size) {
        uploadConfig.maxBytes = config.max_size * 1024;
      }

      file.upload(uploadConfig, (err, uploadedFiles) => {
        if (err) return res.send(500, err);

        return res.json(uploadedFiles);
      });
    } else if (file) {
      return res.send(503, "Config not found, no default specified");
    } else {
      return res.send(422, "No file specified");
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
    const path = './.tmp/uploads/' + configDir + '/' + req.param('file');

    fs.createReadStream(path)
      .on('error', function (err) {
        return res.serverError(err);
      })
      .pipe(res);
  }

};
