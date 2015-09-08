
// -----------Gulp-Jade-Lost v1.0.2 10.08.2015---------------------------------------
// run npm install   /  npm update —save-dev
// run gulp bower    /  bower-update
// run gulp
// --------------------------------------------------------------------

// ------------ToDo----------------------------------------------------
// Bei Fehler schaltet gulp ab
// JS file in dist order crashed Atom / evtl rename?
//
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp        = require("gulp"),
    bower       = require('gulp-bower'),
    data        = require('gulp-data'),
    browserSync = require('browser-sync'),
    jade        = require("gulp-jade"),
    minifyHTML  = require('gulp-minify-html'),
    sass        = require("gulp-sass"),
    postcss     = require("gulp-postcss"),
    autoprefix  = require("gulp-autoprefixer"),
    minify_css  = require("gulp-minify-css"),
    concat      = require("gulp-concat"),
    rename      = require('gulp-rename'),
    uglify      = require("gulp-uglify"),
    jshint      = require("gulp-jshint"),
    sourcemaps  = require("gulp-sourcemaps"),
    notify      = require("gulp-notify"),
    cache       = require('gulp-cache'),
    size        = require('gulp-size'),
    imagemin    = require("gulp-imagemin"),
    pngquant    = require("imagemin-pngquant"),
    lost        = require('lost'),
    del			    = require("del");


// --------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------

var paths = {
    'bower' : './assets/bower',
    'assets': '.',
    'outputDev': './dev',
    'outputDist': './dist'
};


// --------------------------------------------------------------------
// Task: Bower Components
// --------------------------------------------------------------------

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(paths.bower + '/')) ;
});


// --------------------------------------------------------------------
// Task: Jade Templating
// --------------------------------------------------------------------

gulp.task('templates', function() {
  var opts = {
    conditionals: true,
    spare: true
  };
  return gulp.src(paths.assets + '/templates/*.jade')
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest(paths.outputDev + '/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(paths.outputDist + '/'));
});


// --------------------------------------------------------------------
// Task: Sass
// --------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp.src(paths.assets + '/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      onError: browserSync.notify
    }))
    .pipe(postcss([
      lost()
    ]))
    .pipe(autoprefix('last 2 version', 'ie 9'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.outputDev + '/css'))
    .pipe(minify_css())
    .pipe(gulp.dest(paths.outputDist + '/css'))
    .pipe(size({gzip: true}))
    .pipe(browserSync.reload({stream:true}));
});


// --------------------------------------------------------------------
// Task: Scripts
// --------------------------------------------------------------------

gulp.task('scripts', function() {
  return gulp.src(paths.assets + '/scripts/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.outputDev + '/js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.outputDist + '/js'))
    .pipe(browserSync.reload({stream:true}));
});


// --------------------------------------------------------------------
// Task: Compress Images
// --------------------------------------------------------------------

gulp.task('images', function() {
  return gulp.src(paths.assets + '/images/**/*.{gif,jpg,png}')
    .pipe(cache(imagemin({ optimizationLevel: 5, pngquant: true, progressive: true, interlaced: true })))
    .pipe(gulp.dest(paths.outputDev + '/images'))
    .pipe(gulp.dest(paths.outputDist + '/images'));
});


// --------------------------------------------------------------------
// Task: Clean
// --------------------------------------------------------------------

gulp.task('clean', function(cb) {
    del(['./dev/**/*', './dist/**/*'], cb)
});


// --------------------------------------------------------------------
// Task: Watch
// --------------------------------------------------------------------

gulp.task('watch', function() {
  // Watch jade files
  gulp.watch(paths.assets + '/templates/**/*.jade', ['templates']);
  // Watch .scss files
  gulp.watch(paths.assets + '/scss/**/*.scss', ['sass']);
  // Watch .js files
  gulp.watch(paths.assets + '/scripts/**/*.js', ['scripts']);
  // Watch image files
  gulp.watch(paths.assets + '/images/**/*', ['images']);
});


// --------------------------------------------------------------------
// Task: Browser-Sync
// --------------------------------------------------------------------

gulp.task('browserSync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: 'dev'
        }
    });
});


// --------------------------------------------------------------------
// Task: Clean
// --------------------------------------------------------------------

gulp.task('clean', function(cb) {
  del(['./dev/**/*', './dist/**/*'], cb)
});


// --------------------------------------------------------------------
// Task: Default
// --------------------------------------------------------------------

gulp.task('default', ['clean'], function() {
    gulp.start('templates', 'sass', 'scripts', 'images', 'browserSync', 'watch');
});
