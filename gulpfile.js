const fonts = require('./_gulp/fonts.js');
const images = require('./_gulp/images.js');
const css = require('./_gulp/css.js');
const javascript = require('./_gulp/javascript.js');

const { series, watch } = require('gulp');

const watcher = () => {
    watch(['_assets/fonts/**/*'], fonts);
    watch(['_assets/css/**/*', 'content/**/*', '_includes/**/*', '_layouts/**/*'], css);
    watch(['_assets/js/**/*'], javascript);
    watch(['_data/site.js', 'content/img/**/*'], images);
};

exports.default = series([fonts, javascript, css, images]);

exports.watch = watcher;