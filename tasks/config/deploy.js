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

module.exports = function(gulp, plugins, growl, path, tasks) {

  gulp.task('deploy:server', function() {
    return gulp.src('./src/server/dst/**/*')
        .pipe(gulp.dest('./dst'))
        .pipe(plugins.if(growl, plugins.notify({ message: 'Deploy server task complete' })));
  });

  gulp.task('deploy:client', function() {
    return gulp.src('./src/client/dst/**/*')
        .pipe(gulp.dest('./dst/assets'))
        .pipe(plugins.if(growl, plugins.notify({ message: 'Deploy client task complete' })));
  });

};
