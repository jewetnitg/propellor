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
};
