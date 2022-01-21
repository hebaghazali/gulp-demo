const { src, dest, parallel, series, watch } = require('gulp');

// HTML

const globs = {
  htmlTask: 'Twitter/*.html',
  imagesTask: 'Twitter/assets/images/*',
  cssTask: 'Twitter/assets/css/*.css',
  jsTask: 'Twitter/*.js',
};

const inject = require('gulp-inject-string');

const htmlmin = require('gulp-htmlmin');

function htmlTask() {
  return src(globs.htmlTask)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(inject.replace('./main.js', './assets/js/script.min.js'))
    .pipe(inject.replace('assets/css/style.css', 'assets/css/style.min.css'))
    .pipe(dest('dist'));
}

exports.html = htmlTask;

////////////////////////////////////////////////

// Images

const imgmin = require('gulp-imagemin');

function imagesTask() {
  return src(globs.imagesTask).pipe(imgmin()).pipe(dest('dist/assets/images'));
}

exports.images = imagesTask;

////////////////////////////////////////////////

// CSS

const concat = require('gulp-concat');
const cssmin = require('gulp-clean-css');

function cssTask() {
  return src(globs.cssTask)
    .pipe(concat('style.min.css'))
    .pipe(cssmin())
    .pipe(dest('dist/assets/css'));
}

exports.css = cssTask;

////////////////////////////////////////////////

// JavaScript

const jsmin = require('gulp-terser');

function jsTask() {
  return src(globs.jsTask)
    .pipe(concat('script.min.js'))
    .pipe(jsmin())
    .pipe(dest('dist/assets/js'));
}

exports.javascript = jsTask;

////////////////////////////////////////////////

// Watch

function watchTask() {
  watch(globs.htmlTask, series(htmlTask, reload));
  watch(globs.imagesTask, series(imagesTask, reload));
  watch(globs.cssTask, series(cssTask, reload));
  watch(globs.jsTask, series(jsTask, reload));
}

////////////////////////////////////////////////

// BrowserSync

const browserSync = require('browser-sync');

function serve(done) {
  browserSync({
    server: {
      baseDir: 'dist/',
    },
  });
  done();
}

function reload(reloaded) {
  browserSync.reload();
  reloaded();
}

exports.default = series(
  parallel(htmlTask, cssTask, jsTask, imagesTask),
  serve,
  watchTask
);
