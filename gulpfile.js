const images = require('./_gulp/images.js');
const css = require('./_gulp/css.js');

const { parallel, watch } = require('gulp');

const watcher = () => {
    watch('./content/img/**/*', { ignoreInitial: true }, images);
    watch('./_assets/css/**/*', { ignoreInitial: true }, css);
};

exports.default = parallel([images, css]);

exports.watch = watcher;