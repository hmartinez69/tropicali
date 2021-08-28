const { series } = require('gulp');

var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();

const imagemin = require('gulp-imagemin')

function sassTask() {
    // place code for your default task here
    return gulp.src('src/css/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(
            cleanCSS({ 
                compatibility: 'ie8' 
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
};

function html() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
}

function fonts() {
    return gulp.src("src/fonts/*")
        .pipe(gulp.dest('dist/fonts'));
}


function img() {
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });

    gulp.watch('src/*.html', gulp.series('html')).on('change', browserSync.reload);
    gulp.watch('src/css/app.scss', gulp.series('saasTask'));
    gulp.watch('src/fonts/*', gulp.series('fonts'));
    gulp.watch('src/img/*', gulp.series('img'));
}


exports.default = series(html, sassTask, fonts, img, watch);
exports.saasTask = sassTask;
exports.html = html;
exports.watch = watch;
exports.fonts = fonts;
exports.img = img;
