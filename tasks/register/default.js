module.exports = function (gulp, plugins) {
	gulp.task('default', function(cb) {
		plugins.sequence(
      
      'build:server',
      'build:client',
      
      'clean:deploy',
      
      'deploy:server',
      'deploy:client',

      'clean:sails-tasks',
      'copy:sails-tasks',

      'copy:package-json',
      'copy:node-modules',

			cb
		);
	});
};
