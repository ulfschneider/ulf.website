const { dest, src } = require('gulp');
const changed = require('gulp-changed');
const site = require('../_data/site.js');
const SOURCE = ['_assets/fonts/**/*'];
const DEST = `${site.output}/fonts/`;

const processingFonts = () => {
    console.log(`Copying fonts from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(changed(DEST))
        .pipe(dest(DEST));
};

module.exports = processingFonts;