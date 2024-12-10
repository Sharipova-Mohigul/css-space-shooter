/**
 * Created by Michael on 07/11/2014.
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var merge = require('merge-stream');
gulp.task('scripts', function() {

    return gulp.src([
        './scripts/!(game|controller|music)*.js',
        './scripts/music.js',
        './scripts/game.js',
        './scripts/controller.js'
    ])
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/'));
});
gulp.task('less', function() {

    return gulp.src('./styles/app.less')
        .pipe(less())
        .pipe(gulp.dest('./styles'));
});

gulp.task('minify-css', ['less'], function() {

    return gulp.src('./styles/app.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/assets/'));
});
gulp.task('static-assets', function() {
    return gulp.src([
        './assets*/**/*',
        './vendor*/**/*'
    ])
        .pipe(gulp.dest('./dist/'));
 });
 
 gulp.task('build', ['less'], function() {
 
     var sourcesBuild = gulp.src([
         './scripts/!(game|controller|music)*.js',
         './scripts/music.js',
         './scripts/game.js',
         './scripts/controller.js',
         './styles/app.css'
     ], {read: false});
 
 
     return gulp.src('index.src.html')
         .pipe(inject(sourcesBuild, { addRootSlash: false }))
         .pipe(rename('index.html'))
         .pipe(gulp.dest('./'));
 
 });