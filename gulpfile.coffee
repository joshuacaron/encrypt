gulp = require 'gulp'
plumber = require 'gulp-plumber'
uglify = require 'gulp-uglify'
minifyCSS = require 'gulp-minify-css'
gutil = require 'gulp-util'
autoprefixer = require 'gulp-autoprefixer'
del = require 'del'
minifyHTML = require 'gulp-minify-html'
watch = require 'gulp-watch'
rename = require 'gulp-rename'

paths =
  js: "public-src/scripts/*.js"
  css: "public-src/css/*.css"
  html: "public-src/*.html"
  

onError = (error) ->
  gutil.beep()
  console.log error

gulp.task 'build',['js','css','html'], ->

gulp.task 'css', ->
  gulp.src paths.css
    .pipe plumber
      errorHandler: onError
    .pipe autoprefixer()
    .pipe minifyCSS()
    .pipe gulp.dest "public/css"

gulp.task 'js', ->
  gulp.src paths.js
    .pipe plumber
      errorHandler: onError
    .pipe uglify()
    .pipe gulp.dest 'public/scripts'

gulp.task 'html', ->
  gulp.src paths.html
    .pipe plumber
      errorHandler: onError
    .pipe minifyHTML()
    .pipe gulp.dest 'public/'

gulp.task 'default', ['build'], ->
  gulp.src "public-src/favicon.png"
    .pipe gulp.dest "public/"