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

  gulp.task('clean:deploy', function (cb) {  
    return rimraf('./dst', cb);
  });

  gulp.task('clean:sails-tasks', function (cb) {
    return rimraf('./dst/tasks', cb);
  });

};
