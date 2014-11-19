var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
  gulp.src('src/*.coffee')
    .pipe(coffee({ bare: true }).on('error', gutil.log))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
  gulp.watch('src/*.coffee', ['build']);
});

gulp.task('default', ['watch']);
