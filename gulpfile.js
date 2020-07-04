const images = require('./_gulp/images.js');
const fonts = require('./_gulp/fonts.js');
const css = require('./_gulp/css.js');

const { series, watch } = require('gulp');

const watcher = () => {
    watch('./content/img/**/*', { ignoreInitial: true }, images);
    watch('./_assets/css/**/*', { ignoreInitial: true }, css);
};

exports.default = series([images, css]);

exports.watch = watcher;