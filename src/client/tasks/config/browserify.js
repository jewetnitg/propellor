/**
 * Created by RikHoffbauer on 03/05/15.
 *
 * Build client-side javascript using browserify
 *
 * ---------------------------------------------------------------
 *
 * Builds client-side javascript.
 *
 */

'use strict';

var browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    babelify    = require('babelify'),
    sourcemaps  = require('gulp-sourcemaps');

module.exports = function(gulp, plugins, growl) {
  gulp.task('browserify', function () {
    // set up the browserify instance on a task basis
    var b = browserify({
      entries: './src/client/.tmp/js/lib/main.js',
      debug: true
    });

    return b
      .ignore('jade')
      .bundle()
      .pipe(source('main.js'))
      .pipe(buffer())

      .pipe(sourcemaps.init({loadMaps: true}))

      // Add transformation tasks to the pipeline here.

      .pipe(uglify())

      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./src/client/.tmp/'));
  });

  gulp.task('browserify:test', function () {
    // set up the browserify instance on a task basis
    var b = browserify({
      entries: './src/client/test/lib/main.js',
      debug: true
    });

    return b
      .ignore('jade')
      .transform(babelify)
      .bundle()
      .pipe(source('browserified.js'))
      .pipe(buffer())
      .on('error', gutil.log)
      .pipe(gulp.dest('./src/client/test/'));
  });

};
