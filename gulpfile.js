var path        = require('path'),
    fs          = require('fs'),
    gulp        = require('gulp'),
    less        = require('gulp-less-sourcemap'),
    changed     = require('gulp-changed'),
    gutil       = require('gulp-util'),
    notifier    = require('node-notifier')
    ;

var lessBasePath = 'static/css';
var lessFiles     = path.join(fs.realpathSync(lessBasePath), '*.less');


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

gulp.task('watch', function(){
   gulp.watch(lessFiles, ['less']);
});

gulp.task('default', ['less', 'watch']);