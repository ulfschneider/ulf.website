const { dest, src } = require('gulp');

const newer = require('gulp-newer');

const imagemin = require('gulp-imagemin');

const SOURCE = 'content/img/**/*';
const DEST = '_site/img/';
const MAX_WIDTH = 600;



const images = () => {
    return src(SOURCE)
        .pipe(newer(DEST))        
        .pipe(
            imagemin(
                [
                    imagemin.gifsicle({ interlaced: true }),
                    imagemin.mozjpeg({ quality: 85, progressive: true }),
                    imagemin.optipng({ optimizationLevel: 5, interlaced: null })
                ], {
                verbose: true
            }
            )
        )
        .pipe(dest(DEST));
};

module.exports = images;