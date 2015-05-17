'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rsvp = require('rsvp');

var _rsvp2 = _interopRequireDefault(_rsvp);

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

exports['default'] = {

  upload: function upload(config, filename, data, callback) {
    config = config || {};

    var fileName = this.__randomizeFilename(filename);
    var type = config.type || 'binary';
    var dir = config.dir || 'files';

    return this.__writeToTmp(dir, fileName, data, type, callback);
  },

  __randomizeFilename: function __randomizeFilename(filename) {
    return guid() + '-' + filename;
  },

  __writeToTmp: function __writeToTmp(dir, filename, data, type, callback) {
    var path = '../uploads/' + dir + '/' + filename;

    return this.writeToFolder(path, data, type, callback);
  },

  writeToFolder: function writeToFolder(path, data, type, callback) {
    _fs2['default'].writeFile(path, data, type || 'binary', function (err) {
      callback(err, path);
    });
  }

};
module.exports = exports['default'];