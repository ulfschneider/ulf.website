const images = require('./_gulp/images.js');
const css = require('./_gulp/css.js');
const js = require('./_gulp/javascript.js');

const { series, watch } = require('gulp');

const watcher = () => {
    watch(['_data/site.js', 'content/img/**/*'], { ignoreInitial: true }, images);
    watch(['_assets/css/**/*'], { ignoreInitial: true }, css);
    watch(['_assets/js/**/*'], { ignoreInitial: true }, js);
};

exports.default = series([js, images, css]);

exports.watch = watcher;