const { dest, src } = require('gulp');
const changed = require('gulp-changed');
const replace = require('gulp-string-replace');
const site = require('../_data/site.js');
const SOURCE = ['_root/**/*'];
const DEST = `${site.output}`;

const processingRoot = () => {
    console.log(`Processing root from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(changed(DEST))
        .pipe(replace(/{{site.themecolor}}/g, site.themecolor))
        .pipe(dest(DEST));
};

module.exports = processingRoot;