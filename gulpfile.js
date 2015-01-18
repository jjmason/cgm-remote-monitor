var path        = require('path'),
    fs          = require('fs'),
    gulp        = require('gulp'),
    less        = require('gulp-less-sourcemap'),
    changed     = require('gulp-changed'),
    gutil       = require('gulp-util'),
    notifier    = require('node-notifier'),
    browserify  = require('browserify'),
    reactify    = require('reactify'),
    source      = require('vinyl-source-stream'),
    del         = require('del')
    ;

/**
 * Some paths we use, collected here for maintainance sanity
 */
var paths ={
    js:  ['static/js/*.js', 'static/js/components/*.js'],
    less: './static/css/*.less',
    vendor: './static/vendor',
    cssDest: 'static/build/css',
    jsDest:  'static/build/js'
};

/**
 * Helper to create a vendor path
 */
function vendor(name){
    var ext = path.extname(name).substr(1);
    return './static/vendor/' + ext + '/' + name;
}

function requireVendor(bundle,filename, exports){
    bundle = bundle.require(vendor(filename), {expose:exports});
    return {
        bundle: bundle,
        require:function(filename, exports){
            return requireVendor(bundle, filename, exports)
        }
    };
}

function requires(bundle){
    return requireVendor(bundle, 'react-with-addons.js', 'react')
            .require('radio.js', 'radio')
            .require('moment.js', 'moment')
            .require('store.js', 'store').bundle;
}




gulp.task('clean', function(done){
    del('static/build', done);
});

gulp.task('js', function(){
    browserify()
            .require(vendor('react-with-addons.js'), {expose: 'react'})
            .require(vendor('radio.js'), {expose: 'radio'})
            .require(vendor('moment.js'), {expose: 'moment'})
            .require(vendor('store.js'), {expose: 'store'})
            .add(__dirname + '/static/js/app.js')
            .transform(reactify)
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./static/build/js/'));
});


gulp.task('less', function () {
    gulp.src(paths.less)
        .pipe(changed(path.dirname(paths.less)))
        .pipe(less())
        .pipe(gulp.dest('./static/build/css'));
});

gulp.task('build', ['clean', 'less', 'js']);

gulp.task('watch', function(){
   gulp.watch(lessFiles, ['build']);
});

gulp.task('default', ['build', 'watch']);