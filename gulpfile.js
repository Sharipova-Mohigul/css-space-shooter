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
