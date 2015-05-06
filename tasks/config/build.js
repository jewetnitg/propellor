/**
 * Build server and client
 *
 * ---------------------------------------------------------------
 *
 * This gulp task is configured run the tasks defined like the one of this gulp build in the server and client folder
 *
 */

module.exports = function(gulp, plugins, growl, path, tasks) {

  /**
   * Invokes the function from a Grunt configuration module with
   * a single argument - the `grunt` object.
   */
  function invokeConfigFn(_tasks) {
    for (var taskName in _tasks) {
      if (_tasks.hasOwnProperty(taskName)) {
        _tasks[taskName](gulp, plugins, growl, path);
      }
    }
  }

  function invokeConfig(key) {
    invokeConfigFn(tasks[key].config);
    invokeConfigFn(tasks[key].register);
  }

  gulp.task('build:server', function() {
    invokeConfig('server');
  });

  gulp.task('build:client', function() {
    invokeConfig('client');
  });
};
