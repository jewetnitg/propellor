module.exports = function (gulp, plugins) {
	gulp.task('default:client', function(cb) {
		plugins.sequence(
			'clean:client',
      'makeIndexFile:client',
      'babel:client',
      'browserify',
      'copy:client',
      'browserify:test',
			cb
		);
	});
};
