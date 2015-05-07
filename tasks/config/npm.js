/**
 * Deploy server and client
 *
 * ---------------------------------------------------------------
 *
 * deploy:server 
 * copies /src/server/dst to /dst
 *
 * deploy:client
 * copies /src/client/dst/ to /dst/assets
 *
 */

var install = require('gulp-install');

module.exports = function(gulp, plugins, growl, path, tasks) {

  gulp.task('npm:install', function() {
    return gulp.src('./dst/package.json')
        .pipe(install())
        .pipe(plugins.if(growl, plugins.notify({ message: 'Npm install task complete' })));
  });

};
