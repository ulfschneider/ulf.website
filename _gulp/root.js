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
        .pipe(gulpif(isManifest && site.theme_color, replace(/{{site.theme_color}}/g, site.theme_color)))
        .pipe(gulpif(isManifest && site.background_color, replace(/{{site.background_color}}/g, site.background_color)))
        .pipe(dest(DEST));
};

module.exports = processingRoot;