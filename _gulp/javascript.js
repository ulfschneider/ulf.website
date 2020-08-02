const { dest, src } = require('gulp');
const minify = require('gulp-minify');

const SOURCE = ['_assets/js/**/*.js'];
const DEST = '_site/js/';

const processingJS = () => {
    return src(SOURCE)
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            noSource: true
        }))
        .pipe(dest(DEST));
};

module.exports = processingJS;
