const clean = require('./_gulp/clean.js');
const fonts = require('./_gulp/fonts.js');
const images = require('./_gulp/images.js');
const css = require('./_gulp/css.js');
const javascript = require('./_gulp/javascript.js');
const root = require('./_gulp/root.js');

const { series, watch } = require('gulp');

const watcher = () => {
    watch(['_assets/fonts/**/*'], fonts);
    watch(['_assets/css/**/*', 'content/**/*', '_includes/**/*', '_layouts/**/*', '_eleventy/**/*', '_assets/js/**/*'], css);
    watch(['_assets/js/**/*'], javascript);
    watch(['_data/site.js', 'content/img/**/*'], images);
    watch(['_root/**/*'], root);
};

exports.default = series([clean, root, fonts, javascript, css, images]);

exports.watch = watcher;