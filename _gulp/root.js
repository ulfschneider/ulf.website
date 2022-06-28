const { dest, src } = require('gulp');
const changed = require('gulp-changed');
const replace = require('gulp-string-replace');
const gulpif = require('gulp-if');
const site = require('../_data/site.js');
const SOURCE = ['_root/**/*'];
const DEST = `${site.output}/`;

const isManifest = (file) => {
    return file.relative == 'site.webmanifest';
}

const processingRoot = () => {
    console.log(`Processing root from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(changed(DEST))
        .pipe(gulpif(isManifest && site.themeColor, replace(/{{site.themeColor}}/g, site.themeColor)))
        .pipe(gulpif(isManifest && site.backgroundColor, replace(/{{site.backgroundColor}}/g, site.backgroundColor)))
        .pipe(dest(DEST));
};

module.exports = processingRoot;