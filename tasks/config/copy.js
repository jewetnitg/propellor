/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 */
module.exports = function(gulp, plugins, growl) {
  
  gulp.task('copy:sails-tasks', function() {
    return gulp.src('./sails-tasks/**/*.*')
        .pipe(gulp.dest('./dst/tasks'))
        .pipe(plugins.if(growl, plugins.notify({ message: 'Copy sails tasks task complete' })));
  });

  gulp.task('copy:node-modules', function() {
    return gulp.src('./node_modules/**/*.*')
        .pipe(gulp.dest('./dst/node_modules'))
        .pipe(plugins.if(growl, plugins.notify({ message: 'Copy node modules task complete' })));
  });

  gulp.task('copy:package-json', function() {
    return gulp.src('./package.json')
        .pipe(gulp.dest('./dst'))
        .pipe(plugins.if(growl, plugins.notify({ message: 'Copy package.json task complete' })));
  });

};
