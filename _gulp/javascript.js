const { dest, src } = require('gulp');
const changed = require('gulp-changed');
const minify = require('gulp-minify');
const OUTPUT = process.env.OUTPUT ? process.env.OUTPUT : '_site';
const SOURCE = ['_assets/js/**/*.js'];
const DEST = `${OUTPUT}/js/`;

const processingJavascript = () => {
    console.log(`Processing javascript from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(changed(DEST))
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(dest(DEST));
};

module.exports = processingJavascript;