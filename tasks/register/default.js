module.exports = function (gulp, plugins) {
	gulp.task('default', function(cb) {
		plugins.sequence(
      'build:server',
      'build:client',
      'deploy:server',
      'deploy:client',
			cb
		);
	});
};
