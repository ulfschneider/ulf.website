const { dest, src } = require('gulp');
const sharp = require('sharp');
const through = require('through2');
const site = require('../_data/site.js');

const SOURCE = 'content/img/**/*';
const DEST = `${site.output}/img/`;


const MAX_WIDTH = site.imgMaxWidth;
const MAX_HEIGHT = site.imgMaxHeight;
const QUALITY = site.jpegQuality;

const deriveOperations = function(metadata, file) {
    let operations = [];
    let name = file.basename;
    let maxWidth, maxHeight, maxDimension;

    let dimension = name.match(/@(?<dimension>[0-9]+)/i);
    if (dimension) {
        maxDimension = parseInt(dimension.groups.dimension);
    }

    let width = name.match(/@(?<maxWidth>[0-9]+)w/i);
    if (width) {
        maxWidth = parseInt(width.groups.maxWidth);
    }
    if (!maxWidth) {
        maxWidth = maxDimension || MAX_WIDTH;
    }

    let height = name.match(/@(?<maxHeight>[0-9]+)h/i);
    if (height) {
        maxHeight = parseInt(height.groups.maxHeight);
    }
    if (!maxHeight) {
        maxHeight = maxDimension || MAX_HEIGHT;
    }

    if (maxWidth > 0 && metadata.width > maxWidth ||
        maxHeight > 0 && metadata.height > maxHeight) {
        let options = {};
        if (maxWidth > 0 && metadata.width > maxWidth) {
            options.width = maxWidth;
        }
        if (maxHeight > 0 && metadata.height > maxHeight) {
            options.height = maxHeight;
        }
        options.fit = 'inside';
        operations.push({ name: 'resize', arguments: [options] });
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
                    let operations = deriveOperations(metadata, file);
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