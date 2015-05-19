/**
 * Created by RikHoffbauer on 03/05/15.
 * Runs babel on the ./src/client/src directory, puts results int ./src/client/.tmp
 */
module.exports = function(gulp, plugins, growl) {
  var babel = require('gulp-babel');

  gulp.task('babel:client', function() {
    return gulp.src('./src/client/src/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./src/client/.tmp'))
      .pipe(plugins.if(growl, plugins.notify({
        message: "Babel client task completed"}
      )));
  });
};
