var gulp = require('gulp');
// var sass = require('gulp-sass');
var gutil = require('gulp-util');
// var concat = require('gulp-concat');
// var copy = require('gulp-copy');
// var rename = require('gulp-rename');
// var path = require('path');
// var folders = require('gulp-folders');
// var jsx = require('gulp-jsx');
//var react = require('gulp-react');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var rename = require('gulp-rename');
var coffee = require('gulp-coffee');
var source = require('vinyl-source-stream');
var glob = require('glob');
var del = require('del');
var uglify = require('gulp-uglify');

// function jsxify(sourceFolder, destFolder, gulp)
// {
// 	return gulp
// 		.src(sourceFolder + '/*.jsx')
// 		.pipe(react().on('error', gutil.log))
// 		.pipe(gulp.dest(destFolder))
// }

// function buildFolder(sourceFolder, destFolder, gulp)
// {
// 	gulp
// 		.src(sourceFolder + '/*.jsx')
// 		.pipe(react().on('error', gutil.log))
// 		.pipe(gulp.dest(destFolder))

// 	return gulp
// 		.src(sourceFolder + '/*.scss')
// 		.pipe(sass().on('error', gutil.log))
// 		.pipe(gulp.dest(destFolder))
// }

gulp.task('clean', function(cb) {
	return del(['./tmp'], cb);
});

gulp.task('coffee', ['clean'], function() {
	return gulp.src('./src/**/*.coffee')
		.pipe(coffee({ bare:true }).on('error', gutil.log))
		.pipe(gulp.dest('./tmp/js'))
});

gulp.task('browserify-viewer', ['coffee'], function() {
	return browserify({
		debug: true,
		entries: glob.sync('./tmp/js/viewer.js')
	}).bundle()
		.pipe(source('viewer-app.js'))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('browserify-editor', ['coffee'], function() {
	return browserify({
		debug: true,
		entries: glob.sync('./tmp/js/editor.js')
	}).bundle()
		.pipe(source('editor-app.js'))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('minify-viewer', ['browserify-viewer'], function() {
	return gulp.src('./build/js/viewer-app.js')
		.pipe(uglify())
		.pipe(gulp.dest('viewer-app-min.js'))
});

gulp.task('minify-editor', ['browserify-editor'], function() {
	return gulp.src('./build/js/editor-app.js')
		.pipe(uglify())
		.pipe(gulp.dest('editor-app-min.js'))
});

// gulp.task('all', function() {
// 	return browserify({
// 		debug: true,
// 		entries: glob.sync('./tmp/js/**/*.js')
// 	}).bundle()
// 		.pipe(source('viewer-app.js'))
// 		.pipe(gulp.dest('./build/js'));
// });

gulp.task('buildall', ['browserify-viewer', 'browserify-editor']);
gulp.task('build', ['browserify-editor']);

// gulp.task('build', folders('src', function(folder) {
// 	var sourceFolder = path.join('src', folder);
// 	var destFolder = path.join('../site/components', folder);

// 	return buildFolder(sourceFolder, destFolder, gulp);
// }));

gulp.task('watch', ['build'], function() {
	gulp.watch(['./src/**/*'], ['build']);
});

gulp.task('default', ['watch']);