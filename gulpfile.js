var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var karma = require('gulp-karma');
var mocha = require('gulp-mocha');

gulp.task('browserfy', function() {
  return gulp.src(['js/*.js', 'js/externalMethods/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('production.js'))
    .pipe(gulp.dest('js/build'))
    .pipe(uglify())
    .pipe(concat('production.min.js'))
    .pipe(gulp.dest('js/build'));
});

/*gulp.task('test', ['browserfy'], function() {
  return gulp.src('./dummy')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
    }))
    .on('error', function(err) {
      console.log(err);
      this.emit('end');
    });
});*/

gulp.task('test', ['browserfy'], function() {
  return gulp.src('js/tests/*.js')
    .pipe(mocha());
});

gulp.task('default', ['test']);
