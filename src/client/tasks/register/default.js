module.exports = function (gulp, plugins) {
	gulp.task('default:client', function(cb) {
		plugins.sequence(
			'clean:client',
      'browserify',
      'copy:client',
      'cucumber:client',
			cb
		);
	});
};
