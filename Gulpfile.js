var gulp = require('gulp'),
    express = require('express'),
    sass = require('gulp-sass'),
    spawn = require('child_process').spawn,
    livereload = require('gulp-livereload');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = '_site/'


// Run Jekyll Build Asynchronously
gulp.task('jekyll', function () {
    var jekyll = spawn('jekyll', ['build']);

    jekyll.on('exit', function (code) {
        console.log('-- Finished Jekyll Build --')
    })
});


// Compile SASS
gulp.task('sass', function () {
    return gulp.src('*.sass')
        .pipe(sass({'sourceComments': 'map'})) // Turn on source mapping
        .pipe(gulp.dest('_site/assets/css')); // Copy to static dir
});


// Run static file server
gulp.task('serve', function () {
    var server = express();
    server.use(express.static(EXPRESS_ROOT));
    server.listen(EXPRESS_PORT);
});


// Watch for changes
gulp.task('watch', function () {
    var lr = livereload();

    // Manually compile and inject css to avoid jekyll overhead, and utilize livereload injection
    gulp.watch('*.sass', ['sass:dev']);

    // Watch for changes to other files for jekyll compilation
    // Note: This will probably need to be updated with the files you want to watch
    // Second Note: MAKE SURE that the last to items in the watchlist are included or else infinite jekyll loop
    gulp.watch(['*.html', '*/*.html', '*/*.md', '!_site/**', '!_site/*/**'], ['jekyll']);

    // // When a file in the _site directory changes, tell livereload to reload the page
    // gulp.watch(['_site/*/**']).on('change', function (file) {
    //     lr.changed(file.path);
    // });
})


gulp.task('default', ['sass', 'jekyll', 'serve', 'watch']);