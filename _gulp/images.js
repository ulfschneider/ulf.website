const { dest, src } = require('gulp');
const sharp = require('sharp');
const svgo = require('gulp-svgo');
const through = require('through2');
const fs = require('fs');
const path = require('path');
const site = require('../_data/site.js');
const utils = require('../_eleventy/utils.js');
const SOURCE = `${site.input}/img/**/*`;
const DEST = `${site.output}/img/`;


const MAX_WIDTH = site.imgMaxWidth;
const MAX_HEIGHT = site.imgMaxHeight;
const QUALITY = site.imgQuality;

const maxWidthOperation = function(metadata, maxWidth) {
    if (maxWidth > 0) {
        let options = {};
        options.width = maxWidth;
        options.fit = 'inside';
        operation = { name: 'resize', arguments: [options] };
        return operation;
    }
}

const qualityOperation = function(metadata) {
    if (metadata.format == 'jpeg' && QUALITY) {
        return { name: 'jpeg', arguments: [{ quality: QUALITY }] };
    } else if (metadata.format == 'webp' && QUALITY) {
        return { name: 'webp', arguments: [{ quality: QUALITY }] };
    }
}

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
    let quality = qualityOperation(metadata);
    if (quality) {
        operations.push(quality);
    }
    return operations;
}


const webP = async function(file, encoding, callback) {

    let image = sharp(file.contents).webp({ lossless: true });

    const optimize = async function(metadata, maxWidth, suffix) {
        let jpegQuality = jpegQualityOperation(metadata);
        let width = maxWidthOperation(metadata, maxWidth);

        let optimizedImage = await image[width.name].apply(image, width.arguments);
        if (jpegQuality) {
            optimizedImage = await optimizedImage[jpegQuality.name].apply(optimizedImage, jpegQuality.arguments);
        }
        await optimizedImage.toBuffer((err, buffer) => {
            let relative = file.relative.replace(file.basename, file.stem + suffix + file.extname);
            console.log(`Writing ${DEST}${relative}`);
            fs.writeFileSync(`${DEST}${relative}`, buffer);
        });
    }

    await image.metadata()
        .then(async metadata => {
            if (metadata.format != 'gif' && metadata.format != 'svg') {
                file.stem = utils.clearResponsive(file.stem);
                utils.ensureDirectory(`${DEST}${file.relative}`);

                await optimize(metadata, site.responsiveImages.lgWidth, '-lg');
                await optimize(metadata, site.responsiveImages.mdWidth, '-md');
                await optimize(metadata, site.responsiveImages.rgWidth, '-rg');
                await optimize(metadata, site.responsiveImages.smWidth, '-sm');
            }
            //do nothing
            callback(null, file);

        }).catch(imageError => {
            console.log('Error with ' + file.relative);
            console.log(imageError);
            callback(null, file);
        });
}


const webpFormat = async function(file, encoding, callback) {

    let image = sharp(file.contents);
    await image.metadata()
        .then(async metadata => {
            file.basename = utils.clearResponsive(file.basename);

            if (metadata.format == 'webp' || metadata.format == 'gif' || metadata.format == 'svg') {
                //do nothing with a gif/svg             
                callback(null, file);
            } else {
                image = await image.webp({ lossless: true });
                let operations = deriveOperations(metadata, file);
                for (let op of operations) {
                    image = await image[op.name].apply(image, op.arguments);
                }
                await image.toBuffer((err, buffer) => {
                    let relative = file.relative.replace(file.basename, file.stem + '.webp');
                    console.log(`Writing ${DEST}${relative}`);
                    fs.writeFileSync(`${DEST}${relative}`, buffer);
                });

            }
        }).catch(imageError => {
            console.log('Error with ' + file.relative);
            console.log(imageError);
            callback(null, file);
        });
}


const keepFormat = async function(file, encoding, callback) {

    let image = sharp(file.contents);
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
}


const imageTransformer = async function(file, encoding, callback) {
    if (!file.isNull()) {
        keepFormat(file, encoding, callback);
        if (utils.isResponsive(file.basename)) {
            webpFormat(file, encoding, callback);
        }
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
        .pipe(svgo())
        .pipe(dest(DEST));

};


module.exports = processingImages;