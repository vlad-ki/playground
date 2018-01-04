const gulp = require('gulp');
const del = require('del');
const server = require('gulp-server-livereload');
const spawn = require('cross-spawn');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
/*
* Собираем папку build
* Нам нужны все файлы кроме .js
* Потому что .js собирает webpack в файл build/build.js
*/
gulp.task('deploy', function() {
    // sinsce позволяет копировать только измененные файлы
    return gulp.src(['app/**/*.*', '!app/**/*.js'], { since: gulp.lastRun('deploy') })
    .pipe(gulp.dest('build'));
})

/*
* Стартуем сервер с лайврелодом
* Из папки build
*/
gulp.task('webserver', function () {
    gulp.src('build')
        .pipe(server({
            livereload: true,
            open: true
        }));
})

// Запускаем webpack
// app/webpack.config.js
gulp.task('webpack', () =>
    spawn('webpack')
)

// Смотрим за файлами из папки для разработки
// И запускаем копируем изменения в файлы папки билда
gulp.task('watch', function() {
    gulp.watch(['app/**/*.*', '!app/**/*.js'], gulp.series('deploy'))
})

// Удалем старый билд
gulp.task ('clean', () =>
    del('build')
)

if (isDevelopment){
    gulp.task('default', gulp.series('clean', 'deploy',
              gulp.parallel('webpack', 'watch', 'webserver'))
    );
} else {
    gulp.task('default', gulp.series('clean', 'webpack', 'deploy'));
}
