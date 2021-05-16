const { dest, src } = require('gulp');
const rename = require('gulp-rename');

const PluginError = require('plugin-error');

const sharp = require('sharp');
const through = require('through2');
const site = require('../_data/site.js');

const OUTPUT = process.env.OUTPUT ? process.env.OUTPUT : '_site';
const SOURCE = ['content/img/**/*'];
const DEST = `${OUTPUT}/img/`;

const MAX_WIDTH = site.imgMaxWidth;
const MAX_HEIGHT = site.imgMaxHeight;
const PLUGIN_NAME = 'gulp-optimize-images';
const JPEG_QUALITY = site.jpegQuality ? site.jpegQuality : 80;

const imageError = err => {
    this.emit('error', new PluginError(PLUGIN_NAME, 'There is an error while processing the image' + err));
}

const deriveImageOperations = function(metadata) {
    let operations = [];
    if (MAX_WIDTH > 0 && metadata.width > MAX_WIDTH ||
        MAX_HEIGHT > 0 && metadata.height > MAX_HEIGHT) {
        let dimensions = {};
        if (MAX_WIDTH > 0 && metadata.width > MAX_WIDTH) {
            dimensions.width = MAX_WIDTH;
        }
        if (MAX_HEIGHT > 0 && metadata.height > MAX_HEIGHT) {
            dimensions.height = MAX_HEIGHT;
        }
        operations.push({ name: 'resize', arguments: [dimensions] });
    }
    if (metadata.format == 'jpeg' && JPEG_QUALITY) {
        operations.push({ name: 'jpeg', arguments: [{ quality: JPEG_QUALITY }] });
    }
    return operations;
}

const imageTransformer = (file, encoding, callback) => {
    if (!file.isNull()) {
        image = sharp(file.contents);
        image.metadata()
            .then(metadata => {
                if (metadata.format == 'gif' || metadata.format == 'svg') {
                    //do nothing with a gif/svg             
                    callback(null, file);
                } else {
                    let operations = deriveImageOperations(metadata);

                    for (let op of operations) {
                        image = image[op.name].apply(image, op.arguments);
                    }
                    image.toBuffer((err, buffer) => {
                        file.contents = buffer;
                        callback(null, file);
                    });
                }

            }).catch(imageError);
    } else {
        //do nothing
        callback(null, file);
    }
}



const processingImages = () => {
    console.log(`Processing images from ${SOURCE} into ${DEST}`);
    console.log(`imgMaxWidth=${MAX_WIDTH}, imgMaxHeight=${MAX_HEIGHT}, and jpegQuality=${JPEG_QUALITY} (0-100).`);
    console.log(`Change these settings in _data/site.js if desired. GIF files are ignored to be optimized.`);
    return src(SOURCE, { nodir: true })
        .pipe(through.obj(imageTransformer))
        .pipe(dest(DEST));
};

module.exports = processingImages;