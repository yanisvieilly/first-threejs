var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');

gulp.task('coffee', function() {
  gulp.src('src/*.coffee')
    .pipe(coffee({ bare: true }).on('error', gutil.log))
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
  gulp.watch('src/*.coffee', ['coffee']);
});

gulp.task('default', ['watch']);
