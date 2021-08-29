const { series } = require('gulp');

var gulp = require('gulp');

var postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');

var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();

const imagemin = require('gulp-imagemin')

var ghpages = require('gh-pages');

function css() {
    // place code for your default task here
    return gulp.src([
        "src/css/reset.css",
        "src/css/typography.css",
        "src/css/app.css"
    ])
        .pipe(sourcemaps.init())
        .pipe(
            postcss([
                autoprefixer(),
                postcssPresetEnv({
                    stage: 1,
                    browsers: ["IE 11", "last 2 versions"]
                }) 
            ])
        )
        .pipe(concat("app.css"))
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
    gulp.watch('src/css/*', gulp.series('css'));
    gulp.watch('src/fonts/*', gulp.series('fonts'));
    gulp.watch('src/img/*', gulp.series('img'));
}

function deploy() {
    return ghpages.publish('dist', function(err) {});
}

exports.default = series(html, css, fonts, img, watch);
exports.css = css;
exports.html = html;
exports.watch = watch;
exports.fonts = fonts;
exports.img = img;
exports.deploy = deploy;
