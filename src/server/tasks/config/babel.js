/**
 * Created by RikHoffbauer on 03/05/15.
 */
module.exports = function(gulp, plugins, growl) {
  var babel = require('gulp-babel');

  gulp.task('babel:server', function() {
    return gulp.src('./src/server/src/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./src/server/.tmp'));
  });
};
