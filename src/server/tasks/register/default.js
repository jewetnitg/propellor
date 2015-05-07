module.exports = function (gulp, plugins) {
	gulp.task('default:server', function(cb) {
		plugins.sequence(
			'clean:server',
      'babel:server',
      'copy:server',
			cb
		);
	});
};
