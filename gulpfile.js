var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('default', function (cb) {
    pump([
          gulp.src('public/javascripts/*/*.js'),
          uglify(),
          gulp.dest('public/javascripts/dist/')
      ],
      cb
    );
  });