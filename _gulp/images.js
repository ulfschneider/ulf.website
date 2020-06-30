const { dest, src } = require('gulp');
const imagemin = require('gulp-imagemin');

const images = () => {
    return src('content/img/**/*')
        .pipe(
            imagemin(
                [
                    imagemin.gifsicle({ interlaced: true }),
                    imagemin.mozjpeg({ quality: 80, progressive: true }),
                    imagemin.optipng({ optimizationLevel: 5, interlaced: null })
                ], {
                verbose: true
            }
            )
        )
        .pipe(dest('_site/img'));
};

module.exports = images;