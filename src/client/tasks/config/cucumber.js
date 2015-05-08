/**
 * Created by RikHoffbauer on 07/05/15.
 */
var child_process = require('child_process');
var spawn = child_process.spawn;

module.exports = function (gulp, plugins, growl) {
  // this shell command works from root of project: cucumber-js -r src/client/features/ src/client/features/

  gulp.task('cucumber:client', function (cb) {
    var runner = spawn('cucumber-js', ['-r' ,'src/client/features/', 'src/client/features/']);

    runner.stdout.on('data', function(data) {
      process.stdout.write(data);
    });

    runner.stdout.on('end', function(data) {
      cb();
    });
  });
};
