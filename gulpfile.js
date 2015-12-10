var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    connect = require('gulp-connect');

var tsProject = ts.createProject('tsconfig.json', {
    outFile: 'script.js'
});

gulp.task('compile-typescript', function() {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

gulp.task('build', ['compile-typescript']);

gulp.task('serve', ['build'],function() {
    connect.server({
        root: [__dirname],
        port: 8080,
        livereload: true
    });
    gulp.watch(['./**/*.ts'], ['compile-typescript']);
});
