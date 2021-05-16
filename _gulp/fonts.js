const { dest, src } = require('gulp');

const OUTPUT = process.env.OUTPUT ? process.env.OUTPUT : '_site';
const SOURCE = ['_assets/fonts/**/*'];
const DEST = `${OUTPUT}/fonts/`;

const processingFonts = () => {
    console.log(`Processing fonts from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(dest(DEST));
};

module.exports = processingFonts;