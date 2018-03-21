/* Based on https://css-tricks.com/gulp-for-beginners/ */
'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var template_resolver = require('gulp-static-template-resolver');

// Following packages are used for concatenation and minifying refs (css, js)
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin'); // Used to optimize and cache images
var cache = require('gulp-cache');
var del = require('del'); // Used for clean task
var runSequence = require('run-sequence'); // For running the tasks sequentially
var reload = require('require-reload')(require);

// Simply copy all the fonts to dist/fonts
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

// Optimize all image files in src/images folder and copy them to dist/images
gulp.task('images', function() {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            // Setting interlaced to true
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

// Concatenate .js files referenced in html files
// and minify the output
gulp.task('useref', function() {
    return gulp.src('src/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

// Compile scss files
gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('src/css'))
        // Refresh the browser after the css files are compiled
        .pipe(browserSync.reload({
            stream: true
        }))
});  

gulp.task('template', function() {
    return gulp.src('src/templates/**/*.html')
        .pipe(plumber())
        .pipe(template_resolver('./src/templates/resolve/commands.js', './src/templates/resolve/data.json'))
        .pipe(gulp.dest('src/'))
        // Refresh the browser after the css files are compiled
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Compile and refresh the browser if any source files changed
gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/templates/**/*.+(js|html|json)', ['template']);
    /* Reloads the browser whenever HTML or JS files change. 
       We already took care of css changes in the sass task */
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

// Initialize browserSync, and point to the server root
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
    })
})

// Clean generated files
gulp.task('clean:dist', function() {
    return del.sync('dist');
})

// To clear image cache
gulp.task('cache:clear', function() {
    return cache.clearAll()
})

// Our build task first cleans the dist folder, then runs all other tasks
gulp.task('build', function() {
    runSequence('clean:dist', ['sass', 'template'], ['useref', 'images', 'fonts'])
})

gulp.task('default', function() {
    runSequence(['sass', 'template'], ['browserSync', 'watch'])
})