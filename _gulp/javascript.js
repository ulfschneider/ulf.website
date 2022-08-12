const { dest, src } = require('gulp');
const minify = require('gulp-minify');
const replace = require('gulp-string-replace');
const site = require('../_data/site.js');
const utils = require('../_eleventy/utils.js');
const SOURCE = ['_assets/js/**/*.js'];
const DEST = `${site.output}${utils.getBase()}js/`;

const processingJavascript = () => {
    console.log(`Processing javascript from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(replace(/\{\{base\}\}/g, utils.getBase()))
        .pipe(replace(/\{\{trimBase\}\}/g, utils.getBase()))
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(dest(DEST));
};

module.exports = processingJavascript;