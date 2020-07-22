const { dest, src } = require('gulp');
const PluginError = require('plugin-error');

const sharp = require('sharp');
const through = require('through2');

const SOURCE = 'content/img/**/*';
const DEST = '_site/img/';
const site = require('../_data/site.js');
const MAX_WIDTH = site.imgMaxWidth;
const MAX_HEIGHT = site.imgMaxHeight;
const PLUGIN_NAME = 'gulp-optimize-images';
const JPEG_QUALITY = site.jpegQuality ? site.jpegQuality : 80;

const imageError = err => {
    this.emit('error', new PluginError(PLUGIN_NAME, 'There is an error while processing the image' + err));
}

const deriveOperations = function (metadata) {
    let operations = [];
    if (MAX_WIDTH > 0 && metadata.width > MAX_WIDTH
        || MAX_HEIGHT > 0 && metadata.height > MAX_HEIGHT) {
        let dimensions = {};
        if (MAX_WIDTH > 0 && metadata.width > MAX_WIDTH) {
            dimensions.width = MAX_WIDTH;
        }
        if (MAX_HEIGHT > 0 && metadata.height > MAX_HEIGHT) {
            dimensions.height = MAX_HEIGHT;
        }
        operations.push({ operation: 'resize', arguments: [dimensions] });
    }
    if (metadata.format == 'jpeg' && JPEG_QUALITY) {
        operations.push({ operation: 'jpeg', arguments: [{ quality: JPEG_QUALITY }] });
    }
    return operations;
}

const imageTransformer = (file, encoding, callback) => {
    if (!file.isNull()) {
        image = sharp(file.contents);
        image.metadata()
            .then(metadata => {
                let operations = deriveOperations(metadata);

                for (let op of operations) {
                    image = image[op.operation].apply(image, op.arguments);
                }
                image.toBuffer((err, buffer) => {
                    file.contents = buffer;
                    callback(null, file);
                });

            }).catch(imageError);
    } else {
        //do nothing
        callback(null, file);
    }
}

//FIXME error handling with proper file name

const processingImages = () => {
    console.log(`Optimizing and resizing images for imgMaxWidth=${MAX_WIDTH}, imgMaxHeight=${MAX_HEIGHT}, and jpegQuality=${JPEG_QUALITY} (0-100). Change these settings in _data/site.js if desired.`);
    return src(SOURCE)
        .pipe(through.obj(imageTransformer))
        .pipe(dest(DEST));
};

module.exports = processingImages;