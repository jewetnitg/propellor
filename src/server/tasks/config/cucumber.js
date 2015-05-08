/**
 * Created by RikHoffbauer on 07/05/15.
 *
 * I can't get gulp-cucumber working, so this gulp task runs tests using the shell instead.
 * It executes the following command from the root of the project:
 *
 * cucumber-js -r src/client/features/ src/client/features/
 *
 */

var child_process = require('child_process');
var spawn = child_process.spawn;

module.exports = function (gulp) {
  gulp.task('cucumber:server', function (cb) {
    var runner = spawn('cucumber-js', ['-r' ,'src/server/features/', 'src/server/features/']);

    runner.stdout.on('data', function(data) {
      process.stdout.write(data);
    });

    runner.stdout.on('end', function(data) {
      cb();
    });
  });
};
