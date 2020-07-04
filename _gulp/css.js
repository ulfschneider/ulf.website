const { dest, src } = require('gulp');
const postcss = require('gulp-postcss');

const css = () => {
    return src(['_assets/css/main.css', '_assets/css/compose.css'])
        .pipe(postcss())
        .pipe(dest('_site/css/'));
};

module.exports = css;
