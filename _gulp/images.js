const { dest, src } = require('gulp');

const sharp = require('sharp');
const through = require('through2');

const SOURCE = 'content/img/**/*';
const DEST = '_site/img/';
const site = require('../_data/site.js');
const MAX_WIDTH = site.imgMaxWidth ? site.imgMaxWidth : 600;

const imageError = function (err) {
    console.error('There is an error while processing the image ' + err);
}

const imageTransformer = function (file, encoding, callback) {
    if (!file.isNull()) {
        image = sharp(file.contents);
        image.metadata()
            .then(metadata => {
                if (metadata.width > MAX_WIDTH) {
                    image.resize(MAX_WIDTH).toBuffer((err, buffer) => {
                        file.contents = buffer;
                        callback(null, file);
                    });
                } else {
                    //do nothing
                    callback(null, file);
                }
            }).catch(imageError);
    } else {
        //do nothing
        callback(null, file);
    }
}

//FIXME error handling with proper file name

const processingImages = () => {
    console.log('Optimizing and resizing images for imgMaxWidth=' + MAX_WIDTH + '. Change this setting in _data/site.js if desired.');
    return src(SOURCE)
        .pipe(through.obj(imageTransformer))
        .pipe(dest(DEST));
};

module.exports = processingImages;