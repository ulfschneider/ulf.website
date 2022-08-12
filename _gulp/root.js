const { dest, src } = require('gulp');
const replace = require('gulp-string-replace');
const minify = require('gulp-minify');
const gulpif = require('gulp-if');
const site = require('../_data/site.js');
const utils = require('../_eleventy/utils.js');
const SOURCE = ['_root/**/*'];
const DEST = `${site.output}${utils.getBase()}`;

const isManifest = (file) => {
    return file.relative == 'site.webmanifest';
}

const processingRoot = () => {
    console.log(`Processing root from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(gulpif(isManifest && site.theme_color, replace(/\{\{site.theme_color\}\}/g, site.theme_color)))
        .pipe(gulpif(isManifest && site.background_color, replace(/\{\{site.background_color\}\}/g, site.background_color)))
        .pipe(replace(/\{\{base\}\}/g, utils.getBase()))
        .pipe(replace(/\{\{trimBase\}\}/g, utils.getTrimBase()))
        .pipe(minify({
            ext: {
                min: '.js'
            },
            noSource: true
        }))
        .pipe(dest(DEST));
};

module.exports = processingRoot;