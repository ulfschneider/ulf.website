const images = require('./_gulp/images.js');
const { parallel, watch } = require('gulp');

const watcher = () => {
    watch('./content/img/**/*', { ignoreInitial: true }, images);
};

exports.default = parallel(images);

exports.watch = watcher;