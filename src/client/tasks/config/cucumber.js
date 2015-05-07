/**
 * Created by RikHoffbauer on 07/05/15.
 */

var cucumber = require('cucumber');

module.exports = function (gulp, plugins, growl) {
  gulp.task('cucumber:client', function () {
    // this shell command works from root of project: cucumber-js -r src/client/features/ src/client/features/
    return gulp.src('./src/client/features/')
      .pipe(cucumber())
      .pipe(plugins.if(growl, plugins.notify({message: "Cucumber client task completed."})));
  });
};
