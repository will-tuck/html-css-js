var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var fs = require('fs');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var minifycss = require('gulp-minify-css');
var path = require('path');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var tap = require('gulp-tap');
var uglify = require('gulp-uglify');

// css
gulp.task('styles', function() {
    gulp.src(['src/_assets/css/*.scss'])
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions', 'ie 8', 'ie 9', 'chrome > 20']})]))
        .pipe(concat('global.css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('www/_assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// javascript
gulp.task('scripts', function() {
    return gulp.src('src/_assets/js/*.js')
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('global.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('www/_assets/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// images
gulp.task('images', function() {
    gulp.src('src/_assets/img/*?(.gif|.jpg|.jpeg|.png|.svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('www/_assets/img/'))
        .on('end', function() {
            browserSync.reload();
        });
});

// pages
gulp.task('pages', function() {
    // meta information
    var json = JSON.parse(fs.readFileSync('./src/pages.json'));

    return gulp.src('src/pages/**/*.html')
        .pipe(tap(function(file, t) {
            var file_name = path.basename(file.path);
            var file_path = path.relative(file.cwd, file.path).replace('src/pages','');
            var dir_name = path.dirname(file.path).replace('src/pages','www');
            console.log(file_path);
            if (file_path === '/index.html') {
                var include_array = ['src/includes/header.html', 'src/includes/header-home.html', file.path, 'src/includes/footer-home.html', 'src/includes/footer.html'];
            } else {
                var include_array = ['src/includes/header.html', 'src/includes/header-interior.html', file.path, 'src/includes/footer-interior.html', 'src/includes/footer.html'];
            }
            gulp.src(include_array)
            .pipe(replace(/!VERSION!/g, Date.now()))
            .pipe(replace(/!META_DESCRIPTION!/g, json["pages"][file_path]["meta_description"]))
            .pipe(replace(/!META_TITLE!/g, json["pages"][file_path]["meta_title"]))
            .pipe(replace(/!PAGE_TITLE!/g, json["pages"][file_path]["page_title"]))
            .pipe(replace(/!HERO_IMAGE!/g, json["pages"][file_path]["hero_image"]))
            .pipe(replace(/!TYPE_SLUG!/g, json["pages"][file_path]["type_slug"]))
            .pipe(concat(file_name))
            .pipe(gulp.dest(dir_name));
        }))
        .on('end', function() {
            browserSync.reload();
        });
});

// default gulp task: watch
gulp.task('default', function() {

    browserSync({
        startPath: '/',
        proxy: 'https://www.dev.bostonbiomedical-refresh.com.calciumusa.link/',
        reloadDelay: 200,
    });

    gulp.watch('src/_assets/css/*.scss', ['styles','pages']);
    gulp.watch('src/_assets/js/*.js', ['scripts','pages']);
    gulp.watch('src/_assets/img/*?(.gif|.jpg|.jpeg|.png|.svg)', ['images']);

    gulp.watch([path.join('src/', '**', '*.html')], ['pages']);
    gulp.watch(['src/pages.json', 'www/_assets/js/pipeline.json'], ['pages']);

});
