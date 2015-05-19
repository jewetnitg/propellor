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

function makeHashMapEntry (key, path, addComma, forTest) {
  var pathPrefix = forTest ? '../../src/js/' : '../';
  return "  '" + key + "': require('" + pathPrefix + path + "')" + (addComma ? ',' : '') + '\n';
}

function getFilesInDirectory (dir, prefix) {
  return fs.readdirSync(prefix + dir);
}

function makeIndexesForDirectory (key, dir, addComma, prefix, forTest) {
  var files = getFilesInDirectory(dir, prefix),
      str   = '';

  dir = dir.replace(/\/$/g, '');

  for (var i = 0; i < files.length; i++) {
    var filename        = files[i],
        simpleFilename  = filename.replace(/\.js$/gi, ''),
        fullKey         = key + '.' + simpleFilename;

    if (filename.match(/\.js$/gi)) {
      str += makeHashMapEntry(fullKey, dir + '/' + simpleFilename, (addComma && i < files.length), forTest);
    }
  }

  return str;
}

module.exports = function(gulp, plugins, growl) {

  var root = './src/client/src/js/';
  var paths       = {
    'config'      : 'config',
    'adapters'    : 'api/adapters',
    'views'       : 'api/views',
    'services'    : 'api/services',
    'controllers' : 'api/controllers'
  };

  gulp.task('makeIndexFile:client', function(cb) {
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

    return fs.writeFile('./src/client/src/js/lib/files.js', fileStr, cb);
  });

  gulp.task('makeIndexFile:test:client', function(cb) {
    var fileStr = '',
        pairs   = _.pairs(paths),
        len     = pairs.length;

    fileStr += 'module.exports = {\n';

    for (var i = 0; i < len; i++) {
      var key = pairs[i][0],
        dir = pairs[i][1];

      fileStr += makeIndexesForDirectory(key, dir, i !== len - 1, root, true);
    }

    fileStr += '};';

    return fs.writeFile('./src/client/test/lib/files.js', fileStr, cb);
  });
};
