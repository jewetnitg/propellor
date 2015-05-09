/**
 * Created by RikHoffbauer on 09/05/15.
 *
 * TODO: write comments
 *
 * ---------------------------------------------------------------
 */

'use strict';

var fs   = require('fs'),
     _   = require('lodash');

function makeHashMapEntry (key, path, addComma) {
  return "  '" + key + "': require('../" + path + "')" + (addComma ? ',' : '') + '\n';
}

function getFilesInDirectory (dir, prefix) {
  return fs.readdirSync(prefix + dir);
}

function makeIndexesForDirectory (key, dir, addComma, prefix) {
  var files = getFilesInDirectory(dir, prefix),
      str   = '';

  dir = dir.replace(/\/$/g, '');

  for (var i = 0; i < files.length; i++) {
    var filename        = files[i],
        simpleFilename  = filename.replace(/\.js$/gi, ''),
        fullKey         = key + '.' + simpleFilename;

    if (filename.match(/\.js$/gi)) {
      str += makeHashMapEntry(fullKey, dir + '/' + simpleFilename, (addComma && i < files.length));
    }
  }

  return str;
}

module.exports = function(gulp, plugins, growl) {

  var root = './src/server/src/';
  var paths       = {
    'controllers'   : 'api/controllers',
    'policies'      : 'api/policies'
  };


  gulp.task('makeIndexFile:server', function(cb) {
    var fileStr = '',
        pairs   = _.pairs(paths),
        len     = pairs.length;

    fileStr += 'export default {\n';

    for (var i = 0; i < len; i++) {
      var key = pairs[i][0],
          dir = pairs[i][1];

      fileStr += makeIndexesForDirectory(key, dir, i !== len - 1, root);
    }

    fileStr += '};';

    return fs.writeFile('./src/server/src/lib/files.js', fileStr, cb);
  });
};
