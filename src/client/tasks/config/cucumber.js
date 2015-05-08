/**
 * Created by RikHoffbauer on 07/05/15.
 */
// TODO: use cucumber Cli manually (thourhg Cucumber.Cli ?)
var cucumber = require('gulp-cucumber');
var child_process = require('child_process');
var spawn = child_process.spawn;
var exec = child_process.exec;

module.exports = function (gulp, plugins, growl) {
 
  var runCucumberFromShell = function (cb) {
    var runner = spawn('cucumber-js', ['-r' ,'src/client/features/', 'src/client/features/']);
    // exec('cucumber-js -r src/client/features src/client/features', function (error, stdout, stderr) {
    //   plugins.notify({message: "Cucumber client task completed."});
    //   cb();
    // });
    
    
    runner.stdout.on('data', function(data) { 
      // file.write(data); 
      process.stdout.write(data);
    });
    
    runner.stdout.on('end', function(data) {
        // process.stdout.write(data);
        cb();
    });
    
    // runner.on('exit', function(code) {
    //   process.stdout.write("cucumber exited with code:", code);
    //   if (code != 0) {
    //       console.log('Failed: ' + code);
    //   }
    //   cb();
    // });

  };

  gulp.task('cucumber:client', function (cb) {
    // this shell command works from root of project: cucumber-js -r src/client/features/ src/client/features/
    runCucumberFromShell(cb);
    // var cwd = process.cwd();
    // process.chdir(cwd + '/src/client');

    // return gulp.src('./src/client/features/*')
      //.pipe(cucumber({
      //  support: '*support/**/*.js',
      //  steps: '*step_definitions/**/*.js',
      //  format: 'pretty'
      //}))
      // .pipe(cucumber({}))
      // .pipe(process.chdir(cwd))
      // .pipe(plugins.if(growl, plugins.notify({message: "Cucumber client task completed."})));
  });
};
