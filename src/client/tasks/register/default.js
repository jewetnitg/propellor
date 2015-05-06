module.exports = function (gulp, plugins) {
	gulp.task('default', function(cb) {
		plugins.sequence(
			'clean:client',
      'browserify',
      'copy:client',
			cb
		);
	});
};
