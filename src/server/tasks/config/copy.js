/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * Copies all directories and files from
 * ./src/server/.tmp
 * and
 * all non js files from ./src/server/src
 * to ./src/server/dst
 *
 */
module.exports = function(gulp, plugins, growl) {
	gulp.task('copy:server', function() {
		return gulp.src(['./src/server/.tmp/**/*.*', './src/server/src/**/*.!(js)'])
				.pipe(gulp.dest('./src/server/dst'))
				.pipe(plugins.if(growl, plugins.notify({ message: 'Copy server task complete' })));
	});
};
