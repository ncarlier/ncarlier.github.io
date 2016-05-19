var gulp        = require('gulp'),
    less        = require('gulp-less'),
    ejs         = require('gulp-ejs'),
    yaml        = require('js-yaml'),
    markdown    = require('markdown'),
    exec        = require('child_process').exec,
    merge       = require('merge-stream'),
    browserSync = require('browser-sync'),
    deploy      = require('gulp-gh-pages'),
    del         = require('del'),
    fs          = require('fs');

var reload = browserSync.reload;

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('templates', ['clean'], function () {
  var context = yaml.safeLoad(fs.readFileSync('data.yml', 'utf-8'));
  context.markdown = markdown.parse;
  var readme = gulp.src('src/templates/README.md')
  .pipe(ejs(context, {ext: '.md'}))
  .pipe(gulp.dest('dist/'));
  var index = gulp.src('src/templates/index.html')
  .pipe(ejs(context))
  .pipe(gulp.dest('dist/'));
  return merge(readme, index);
})

gulp.task('doc', ['build'], function(cb) {
  exec('pandoc dist/README.md -o dist/resume.docx', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('assets', ['clean'], function() {
  return gulp.src('src/assets/**').pipe(gulp.dest('dist/assets'));
});

gulp.task('styles', ['clean'], function() {
  return gulp.src('src/styles/index.less')
    .pipe(less())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('site', function () {
  return gulp.src('./dist/**/*').pipe(deploy({branch: 'master'}));
});

gulp.task('build', ['templates', 'styles', 'assets']);

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  // Watch template files
  gulp.watch('src/templates/**/*', ['builds', reload]);
  // Watch data file
  gulp.watch('data.yml', ['build', reload]);
  // Watch style files
  gulp.watch('src/styles/**/*.less', ['build', reload]);
  // Watch javascript files
  gulp.watch('src/scripts/**/*.js', ['build', reload]);
  // Watch image files
  gulp.watch('src/images/**/*', ['build', reload]);

});

gulp.task('default', ['build']);
