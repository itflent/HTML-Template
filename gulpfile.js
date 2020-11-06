const paths = { app: './app', build: './build' }

const
  // ! Gulp
  gulp = require('gulp'),
  // ! Css
  sass = require('gulp-sass'),
  prefixer = require('gulp-autoprefixer'),
  csscomb = require('gulp-csscomb'),
  // ! Html
  pug = require('gulp-pug'),
  prettyHTML = require('gulp-pretty-html'),
  htmlmin = require('gulp-htmlmin'),
  // ! Js
  uglify = require('gulp-uglify-es').default,
  // ! Need
  fs = require('fs'),
  replace = require('gulp-replace')
  plumber = require('gulp-plumber'),
  imagemin = require('gulp-imagemin'),
  fonter = require('gulp-fonter'),
  browserSync = require('browser-sync');

gulp.task('hypertexts', async() => {
  gulp.src(`${paths.app}/pages/*.pug`, { ignore: [`${paths.app}/pages/templates/*.pug`, `${paths.app}/pages/components/*.pug`] })
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(prettyHTML({ indent_size: 2, indent_char: ' ' }))
    .pipe(gulp.dest(`${paths.build}`))
  gulp.src(`${paths.app}/pages/**/*.pug`)
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('styles', async() => {
  gulp.src(`${paths.app}/sass/*+(scss|sass)`, { ignore: [`${paths.app}/sass/assets/*.+(scss|sass)`, `${paths.app}/sass/commponents/*.+(scss|sass)`] })
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(csscomb())
    .pipe(gulp.dest(`${paths.build}/css`))
  gulp.src(`${paths.app}/sass/**/*+(scss|sass)`)
    .pipe(browserSync.reload({ stream: true })) 
})

gulp.task('scripts', async() => {
  gulp.src(`${paths.app}/js/**/*.js`)
    .pipe(plumber())
    .pipe(gulp.dest(`${paths.build}/js`))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('watch', async() => {
  browserSync.init({ server: { baseDir: paths.build }, notify: false })
  gulp.watch(`${paths.app}/pages/**/*.pug`, gulp.series('hypertexts'))
  gulp.watch(`${paths.app}/sass/**/*+(scss|sass)`, gulp.series('styles'))
  gulp.watch(`${paths.app}/js/**/*.js`, gulp.series('scripts'))
})

gulp.task('fonts', async() => {
  gulp.src(`${paths.app}/fonts/*`)
    .pipe(fonter({ formats: ['ttf', 'woff'] }))
    .pipe(gulp.dest(`${paths.build}/fonts`))
})

gulp.task('prod', async() => {
  gulp.src(`${paths.app}/sass/*+(scss|sass)`, { ignore: [`${paths.app}/sass/assets/*.+(scss|sass)`, `${paths.app}/sass/commponents/*.+(scss|sass)`] })
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(prefixer({ grid: true }))
    .pipe(gulp.dest(`${paths.build}/css`))
  gulp.src(`${paths.app}/js/*.js`)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.build}/js`))
  gulp.src(`${paths.build}/img/*`)
    .pipe(plumber())
    .pipe(imagemin({ progressive: true, optimizationLevel: 3 }))
    .pipe(gulp.dest(`${paths.build}/img`))
  setTimeout(() => {
    gulp.src(`${paths.app}/pages/*.pug`)
    .pipe(plumber())
    .pipe(pug())
    .pipe(replace(/<link rel="stylesheet" href="([^\.]+\.css)"[^>]*>/g, (s, filename) => {
      return `<style>${fs.readFileSync(`${paths.build}/${filename}`, 'utf-8')}</style>`
    }))
    .pipe(replace(/<script src="([^\.]+\.js)"[^>]*><\/script>/g, (s, filename) => {
      return `<script>${fs.readFileSync(`${paths.build}/${filename}`, 'utf-8')}</script>`
    }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(`${paths.build}/`))
  }, 1500)
})

gulp.task('server', async() => {
  browserSync.init({ server: { baseDir: paths.build }, notify: false })
})

gulp.task('dev', gulp.parallel('hypertexts', 'styles', 'scripts'))
gulp.task('default', gulp.series('dev', 'watch'))