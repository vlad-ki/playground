'use strict';
var path = require('path')

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
/*
* Собираем весь js в файл build/build.js
*/
module.exports = {
    entry: './app',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'build.js'
    },
    // Включаем обновление файла build/build.js
    // при обновлении модулей в папке с проектом app
    watch: isDevelopment,
    watchOptions: {
    aggregateTimeout: 100
    },
    // Помечаем оригинальные файлы модулей (sourcemap)
    devtool: isDevelopment ? 'eval' : null,
    // Прогоняем весь .js через babel
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }]
    }
}