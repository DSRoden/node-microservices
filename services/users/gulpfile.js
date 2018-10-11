const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

/*
tasks
 */

gulp.task('start', () => {
  nodemon({
    script: './src/server',
    ext: 'js html',
    tasks: ['lint'],
  });
});

gulp.task('lint', () => (
  gulp.src(['src/**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
));

/*
default
 */
var build = gulp.series(gulp.parallel('start', 'lint'))
gulp.task('default', build)