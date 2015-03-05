var gulp        = require('gulp'),
    less        = require('gulp-less'),
    ejs         = require('gulp-ejs'),
    yaml        = require('js-yaml'),
    markdown    = require('markdown'),
    browserSync = require('browser-sync'),
    deploy      = require('gulp-gh-pages'),
    del         = require('del'),
    fs          = require('fs');


var reload = browserSync.reload;

gulp.task('templating', function () {
  var context = yaml.safeLoad(fs.readFileSync('data.yml', 'utf-8'));
  context.markdown = markdown.parse;
  gulp.src('src/templates/index.html')
  .pipe(ejs(context))
  .pipe(gulp.dest('dist/'));
  gulp.src('src/templates/README.md')
  .pipe(ejs(context, {ext: '.md'}))
  .pipe(gulp.dest('dist/'));
})

gulp.task('assets', function() {
  gulp.src('src/assets/**').pipe(gulp.dest('dist/assets'));
});

gulp.task('styles', function() {
  gulp.src('src/styles/index.less')
    .pipe(less())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function() {
  // Watch template files
  gulp.watch('src/templates/**/*', ['templating', reload]);
  // Watch data file
  gulp.watch('data.yml', ['templating', reload]);
  // Watch style files
  gulp.watch('src/styles/**/*.less', ['styles', reload]);
  // Watch javascript files
  gulp.watch('src/scripts/**/*.js', ['scripts', reload]);
  // Watch image files
  gulp.watch('src/images/**/*', ['images', reload]);
});

gulp.task('serve', ['default', 'watch'], function() {
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });
});

gulp.task('site', function () {
  return gulp.src('./dist/**/*').pipe(deploy({branch: 'master'}));
});

gulp.task('clean', function(cb) {
  del(['dist'], cb)
});

gulp.task('default', ['clean'], function() {
  gulp.start('assets');
  gulp.start('styles');
  gulp.start('templating');
});
