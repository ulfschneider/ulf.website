const { dest, src } = require('gulp');
const postcss = require('gulp-postcss');

const SOURCE = ['_assets/css/compose.css', '_assets/css/main.css'];
const DEST = '_site/css/';

const css = () => {
    return src(SOURCE)        
        .pipe(postcss())
        .pipe(dest(DEST));
};

module.exports = css;
