/**
 * Created by RikHoffbauer on 07/05/15.
 */
// TODO: use cucumber Cli manually (thourhg Cucumber.Cli ?)
var cucumber = require('gulp-cucumber');

module.exports = function (gulp, plugins, growl) {
  gulp.task('cucumber:client', function () {
    // this shell command works from root of project: cucumber-js -r src/client/features/ src/client/features/

    var cwd = process.cwd();
    process.chdir(cwd + '/src/client');

    return gulp.src('./src/client/features/*')
      //.pipe(cucumber({
      //  support: '*support/**/*.js',
      //  steps: '*step_definitions/**/*.js',
      //  format: 'pretty'
      //}))
      .pipe(cucumber({}))
      .pipe(process.chdir(cwd))
      .pipe(plugins.if(growl, plugins.notify({message: "Cucumber client task completed."})));
  });
};
