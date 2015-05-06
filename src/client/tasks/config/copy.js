/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, except coffeescript and less files, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 */
module.exports = function(gulp, plugins, growl) {
	gulp.task('copy:client', function() {
		return gulp.src(['./src/client/.tmp/**/*.*', './src/client/src/**/*.!(js)'])
				.pipe(gulp.dest('./src/client/dst'))
				.pipe(plugins.if(growl, plugins.notify({ message: 'Copy client task complete' })));
	});
};
