'use strict';

// * Paths To Folders - variables
const paths = {
  app: './app',
  build: './build',
}

// * Gulp Requires - variables
const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  pug = require('gulp-pug'),
  prefixer = require('gulp-autoprefixer'),
  prettyHTML = require('gulp-pretty-html'),
  rename = require('gulp-rename'),
  minifierCSS = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync');

// * Pug Compile - task
gulp.task('hypertexts', () => {
  return gulp.src(`${paths.app}/pages/*.pug`)
    .pipe(pug( {pretty: true} ))
    .pipe(prettyHTML( {indent_size: 2, indent_char: ' '} ))
    .pipe(gulp.dest(`${paths.build}`))
    .pipe(browserSync.reload( {stream: true} ))
})

gulp.task('hypertexts-layouts', () => {
  return gulp.src(`${paths.app}/pages/layouts/*.pug`)
    .pipe(browserSync.reload( {stream: true} ))
})

// * Sass Compile - task
gulp.task('styles', () => {
  return gulp.src(`${paths.app}/sass/**/*+(scss|sass)`)
    .pipe(browserSync.reload( {stream: true} ))
    .pipe(sass( {outputStyle: "expanded"} ))
    .pipe(prefixer( {grid: true} ))
    // ! First File (__name.css) Expanded
    .pipe(rename( {suffix: '', extname: '.css'} ))
    .pipe(gulp.dest(`${paths.build}/css`))
    // ! Second File (__name.min.css) Minifier
    .pipe(minifierCSS())
    .pipe(rename( {suffix: '.min', extname: '.css'} ))
    .pipe(gulp.dest(`${paths.build}/css`))
})

// * Javascript Minifify - task
gulp.task('scripts', () => {
  return gulp.src(`${paths.app}/js/**/*.js`)
    .pipe(browserSync.reload( {stream: true} ))
    // ! First File (__name.js) Expanded
    .pipe(rename( {suffix: '', extname: '.js'} ) )
    .pipe(gulp.dest(`${paths.build}/js`))
})

// * Image Compress - task
gulp.task('imgs', () => {
  return gulp.src(`${paths.app}/img/**/*`)
    .pipe(imagemin( {progressive: true} ))
    .pipe(gulp.dest(`${paths.build}/img`))
})

// * All Watches
gulp.task('watch', () => {
  // * Browser Sync - server
  browserSync.init({
    server: {baseDir: paths.build},
    notify: false,
  })
  // * Image compress
  gulp.watch(`${paths.app}/img/**/*`, gulp.series('imgs'))
  // * Pug - Watch Files
  gulp.watch(`${paths.app}/pages/**/*.pug`, gulp.series('hypertexts'))
  gulp.watch(`${paths.app}/pages/layouts/*.pug`, gulp.parallel('hypertexts-layouts', 'hypertexts'))
  // * Sass - Watch Files
  gulp.watch(`${paths.app}/sass/**/*+(scss|sass)`, gulp.series('styles'))
  // * JavaScript - Watch Files
  gulp.watch(`${paths.app}/js/**/*.js`, gulp.series('scripts'))
})

// * Default Task - task
gulp.task('default', gulp.series(gulp.parallel('hypertexts', 'styles', 'scripts'), 'watch'))