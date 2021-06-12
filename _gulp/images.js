const { dest, src } = require('gulp');
const sharp = require('sharp');
const through = require('through2');

const OUTPUT = process.env.OUTPUT ? process.env.OUTPUT : '_site';
const SOURCE = 'content/img/**/*';
const DEST = `${OUTPUT}/img/`;

const site = require('../_data/site.js');

const MAX_WIDTH = site.imgMaxWidth;
const MAX_HEIGHT = site.imgMaxHeight;
const QUALITY = site.jpegQuality;

const deriveOperations = function(metadata) {
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
    if (metadata.format == 'jpeg' && QUALITY) {
        operations.push({ name: 'jpeg', arguments: [{ quality: QUALITY }] });
    }
    return operations;
}

const imageTransformer = async(file, encoding, callback) => {
    if (!file.isNull()) {
        image = sharp(file.contents);
        await image.metadata()
            .then(async metadata => {
                if (metadata.format == 'gif' || metadata.format == 'svg') {
                    //do nothing with a gif/svg             
                    callback(null, file);
                } else {
                    let operations = deriveOperations(metadata);
                    for (let op of operations) {
                        image = await image[op.name].apply(image, op.arguments);
                    }
                    await image.toBuffer((err, buffer) => {
                        file.contents = buffer;
                        console.log(`Writing ${DEST}${file.relative}`);
                        callback(null, file);
                    });

                }
            }).catch(imageError => {
                console.log('Error with ' + file.relative);
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

    return src(SOURCE, { nodir: true })
        .pipe(through.obj(imageTransformer))
        .pipe(dest(DEST));
};


module.exports = processingImages;