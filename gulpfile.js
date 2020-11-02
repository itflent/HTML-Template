const paths = {app: './app', build: './build'}

const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  pug = require('gulp-pug'),
  prefixer = require('gulp-autoprefixer'),
  prettyHTML = require('gulp-pretty-html'),
  htmlmin = require('gulp-htmlmin'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync');

gulp.task('hypertexts', () => {
  return gulp.src(`${paths.app}/pages/*.pug`, {ignore: [`${paths.app}/pages/templates/*.pug`, `${paths.app}/pages/components/*.pug`]})
    .pipe(pug( {pretty: true} ))
    .pipe(prettyHTML( {indent_size: 2, indent_char: ' '} ))
    .pipe(gulp.dest(`${paths.build}`))
    .pipe(browserSync.reload( {stream: true} ))
})

gulp.task('styles', () => {
  return gulp.src(`${paths.app}/sass/*+(scss|sass)`, {ignore: [`${paths.app}/sass/assets/*.+(scss|sass)`, `${paths.app}/sass/commponents/*.+(scss|sass)`]})
    .pipe(sass( {outputStyle: "expanded"} ))
    .pipe(gulp.dest(`${paths.build}/css`))
    .pipe(browserSync.reload( {stream: true} ))
})

gulp.task('scripts', () => {
  return gulp.src(`${paths.app}/js/**/*.js`)
    .pipe(gulp.dest(`${paths.build}/js`))
    .pipe(browserSync.reload( {stream: true} ))
})

gulp.task('imgs', () => {
  return gulp.src(`${paths.app}/img/**/*`)
    .pipe(imagemin( {progressive: true} ))
    .pipe(gulp.dest(`${paths.build}/img`))
})

gulp.task('watch', () => {
  browserSync.init( {server: {baseDir: paths.build}, notify: false} )
  gulp.watch(`${paths.app}/img/**/*`, gulp.series('imgs'))
  gulp.watch(`${paths.app}/pages/**/*.pug`, gulp.series('hypertexts'))
  gulp.watch(`${paths.app}/sass/**/*+(scss|sass)`, gulp.series('styles'))
  gulp.watch(`${paths.app}/js/**/*.js`, gulp.series('scripts'))
})

gulp.task('prod', async () => {
  gulp.src(`${paths.app}/sass/*+(scss|sass)`, {ignore: [`${paths.app}/sass/assets/*.+(scss|sass)`, `${paths.app}/sass/commponents/*.+(scss|sass)`]})
    .pipe(sass( {outputStyle: "compressed"} ))
    .pipe(prefixer( {grid: true} ))
    .pipe(gulp.dest(`${paths.build}/css`))
  gulp.src(`${paths.app}/js/*.js`)
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.build}/js`))
  gulp.src(`${paths.app}/pages/*.pug`)
    .pipe(pug())
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(`${paths.build}/`))
})

gulp.task('dev', gulp.parallel('hypertexts', 'styles', 'scripts'))

gulp.task('default', gulp.series('dev', 'watch'))