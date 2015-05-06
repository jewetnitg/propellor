module.exports = function (gulp, plugins) {
	gulp.task('default', function(cb) {
		plugins.sequence(
			'clean:server',
      'babel:server',
      'copy:server',
			cb
		);
	});
};
