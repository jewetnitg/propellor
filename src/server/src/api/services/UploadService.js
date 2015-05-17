import fs from 'fs';
import RSVP from 'rsvp';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export default {

  upload (config, filename, data, callback) {
    config = config || {};

    const fileName = this.__randomizeFilename(filename);
    const type     = config.type || "binary";
    const dir      = config.dir || "files";

    return this.__writeToTmp(dir, fileName, data, type, callback);
  },

  __randomizeFilename(filename) {
    return guid() + "-" + filename;
  },

  __writeToTmp(dir, filename, data, type, callback) {
    const path = "../uploads/" +  dir + '/' + filename;

    return this.writeToFolder(path, data, type, callback);
  },

  writeToFolder(path, data, type, callback) {
    fs.writeFile(path, data, (type || 'binary'), (err) => {
      callback(err, path);
    });
  }

};
