const { dest, src } = require('gulp');
const postcss = require('gulp-postcss');

const OUTPUT = process.env.OUTPUT ? process.env.OUTPUT : '_site';
const SOURCE = ['_assets/css/main.css'];
const DEST = `${OUTPUT}/css/`;

const processingCSS = () => {
    console.log(`Processing CSS from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(postcss())
        .pipe(dest(DEST));
};

module.exports = processingCSS;