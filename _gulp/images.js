const { dest, src } = require('gulp');
const newer = require('gulp-newer');
const gulpif = require('gulp-if');

const through = require('through2');
const path = require('path')
const scaleImages = require('gulp-scale-images');
const imagemin = require('gulp-imagemin');

const SOURCE = 'content/img/**/*';
const DEST = '_site/img/';

const site = require('../_data/site.js');
const MAX_WIDTH = site.imgMaxWidth;
const NEWER = site.newer == undefined ? true : site.newer;

const computeScaleInstructions = (file, _, cb) => {
    file.scale = {
        maxWidth: MAX_WIDTH,
    }
    cb(null, file)
}

const computeFileName = (output, scale, cb) => {
    const fileName = path.basename(output.path);
    cb(null, fileName)
}

const images = () => {
    if (!NEWER) {
        console.log('newer is configured to be false in site.js, therefore optimizing all images');
    } else {
        console.log('Optimizing only images where the source is newer than the destination');
    }
    if (MAX_WIDTH <= 0) {
        console.log('No imgMaxWidth set in site.js, therefore not scaling down images');
    }
    
    return src(SOURCE)
        .pipe(gulpif(NEWER, newer(DEST)))
        .pipe(gulpif(MAX_WIDTH > 0,
            through.obj(computeScaleInstructions)))
        .pipe(gulpif(MAX_WIDTH > 0,
            scaleImages(computeFileName)))
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