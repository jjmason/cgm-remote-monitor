var path        = require('path'),
    fs          = require('fs'),
    gulp        = require('gulp'),
    less        = require('gulp-less-sourcemap'),
    changed     = require('gulp-changed'),
    gutil       = require('gulp-util'),
    notifier    = require('node-notifier'),
    browserify  = require('gulp-browserify'),
    concat      = require('gulp-concat'),
    clean       = require('gulp-clean')
    ;

var lessBasePath  = 'static/css';
var lessFiles     = path.join(fs.realpathSync(lessBasePath), '*.less');
var appScript     = fs.realpathSync('static/js/app.js');
var buildPath     = fs.realpathSync('static/js/build/');
var shim          = {
    react: {
        path: '/static/js/vendor/react-with-addons.js',
        exports: 'React'
    },
    radio: {
        path: '/static/js/vendor/radio.js',
        exports: 'radio'
    },
    moment: {
        path: '/static/js/vendor/moment.js',
        exports: 'moment'
    }
};

gulp.task('clean', function(){
    return gulp.src([buildPath + "/*.js", path.dirname(lessFiles) + "/*.css"])
               .pipe(clean());
});

gulp.task('scripts', function(){
    return gulp.src(appScript)
        .pipe(browserify({
            shim: shim,
            debug: !gulp.env.production,
            insertGlobals: true
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(buildPath));
});


gulp.task('less', function () {
    var cssDestination = path.dirname(lessFiles);

    return gulp
        .src(lessFiles)
        .pipe(changed(cssDestination, {extension: '.css'}))
        .pipe(less())
        .on('error', function (error) {
            gutil.log(gutil.colors.red(error.message))
            // Notify on error. Uses node-notifier
            notifier.notify({
                title: 'Less compilation error',
                message: error.message
            })
        })
        .pipe(gulp.dest(cssDestination));
});

gulp.task('build', ['clean', 'less', 'scripts']);

gulp.task('watch', function(){
   gulp.watch(lessFiles, ['build']);
});

gulp.task('default', ['build', 'watch']);