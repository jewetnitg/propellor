/**
 * Clean files and folders.
 *
 * ---------------------------------------------------------------
 *
 * This gulp task is configured to clean out the contents in the .tmp/public of your
 * sails project.
 *
 */

var rimraf = require('rimraf');

module.exports = function(gulp, plugins, growl) {

  gulp.task('clean:server', function(cb) {
    return rimraf('./src/server/dst', function () {
      return rimraf('./src/server/.tmp', cb);
    });
  });

};
