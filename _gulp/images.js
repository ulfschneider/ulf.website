const { dest, src } = require('gulp');
const Jimp = require('jimp');
const through = require('through2');
const OUTPUT = process.env.OUTPUT ? process.env.OUTPUT : '_site';
const SOURCE = ['content/img/**/*'];
const DEST = `${OUTPUT}/img/`;

const site = require('../_data/site.js');

const MAX_WIDTH = site.imgMaxWidth;
const MAX_HEIGHT = site.imgMaxHeight;
const QUALITY = site.jpegQuality;

const getHeight = function(image) {
    return MAX_HEIGHT || image.getHeight();
}

const getWidth = function(image) {
    return MAX_WIDTH || image.getWidth();
}

const imageTransformer = async(file, encoding, callback) => {
    if (!file.isNull() && file.extname != '.svg') {
        await Jimp.read(file.contents)
            .then(image => {
                const mime = image.getMIME();
                if (mime.indexOf('gif') >= 0 || mime.indexOf('svg') >= 0) {
                    callback(null, file);
                } else if (QUALITY) {
                    image.scaleToFit(getWidth(image), getHeight(image))
                        .quality(QUALITY)
                        .getBuffer(image.getMIME(), (err, buffer) => {
                            file.contents = buffer;
                            console.log(file.relative);
                            callback(null, file);
                        });
                } else {
                    image.scaleToFit(getWidth(image), getHeight(image))
                        .getBuffer(image.getMIME(), (err, buffer) => {
                            file.contents = buffer;
                            console.log(file.relative);
                            callback(null, file);
                        });
                }
            }).catch(imageError => {
                console.log('Image not processed ' + file.relative);
                console.log(imageError);
                callback(null, file);
            });
    } else {
        //do nothing
        callback(null, file);
    }
}

const processingImages = () => {
    console.log(`Processing images from ${SOURCE} into ${DEST}`);
    console.log(`imgMaxWidth=${MAX_WIDTH}, imgMaxHeight=${MAX_HEIGHT}, and jpegQuality=${QUALITY} (0-100).`);
    console.log(`Change these settings in _data/site.js if desired. GIF files are ignored to be optimized.`);
    return src(SOURCE)
        .pipe(through.obj(imageTransformer))
        .pipe(dest(DEST));
};

module.exports = processingImages;