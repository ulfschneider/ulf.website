const { dest, src } = require('gulp');
const changed = require('gulp-changed');

const OUTPUT = process.env.OUTPUT ? process.env.OUTPUT : '_site';
const SOURCE = ['_assets/fonts/**/*'];
const DEST = `${OUTPUT}/fonts/`;

const processingFonts = () => {
    console.log(`Processing fonts from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(changed(DEST))
        .pipe(dest(DEST));
};

module.exports = processingFonts;