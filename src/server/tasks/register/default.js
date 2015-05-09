module.exports = function (gulp, plugins) {
	gulp.task('default:server', function(cb) {
		plugins.sequence(
			'clean:server',
      'makeIndexFile:server',
      'babel:server',
      'copy:server',
      'cucumber:server',
			cb
		);
	});
};
