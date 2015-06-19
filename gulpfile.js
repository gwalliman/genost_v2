var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');

gulp.task('test', function() {
  return gulp.src('js/tests/*.js')
    .pipe(jasmine());
});

gulp.task('default', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('production.js'))
    .pipe(gulp.dest('js/build'));
});

gulp.task('default', ['test']);
