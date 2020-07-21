const { dest, src } = require('gulp');
const gulpif = require('gulp-if');

const through = require('through2');
const path = require('path')
const scaleImages = require('gulp-scale-images');

const SOURCE = 'content/img/**/*';
const DEST = '_site/img/';

const site = require('../_data/site.js');
const MAX_WIDTH = site.imgMaxWidth;

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

const processingImages = () => {
    if (MAX_WIDTH <= 0) {
        console.warn('No imgMaxWidth set in site.js, therefore not scaling down images');
    }

    return src(SOURCE)
        .pipe(gulpif(MAX_WIDTH > 0,
            through.obj(computeScaleInstructions)))
        .pipe(gulpif(MAX_WIDTH > 0,
            scaleImages(computeFileName)))
        .pipe(dest(DEST));
};

module.exports = processingImages;