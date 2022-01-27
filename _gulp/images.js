const { dest, src } = require('gulp');
const sharp = require('sharp');
const svgo = require('gulp-svgo');
const through = require('through2');
const fs = require('fs');
const path = require('path');
const site = require('../_data/site.js');

const SOURCE = `${site.input}/img/**/*`;
const DEST = `${site.output}/img/`;

const MAX_WIDTH = site.imgMaxWidth;
const MAX_HEIGHT = site.imgMaxHeight;
const QUALITY = site.jpegQuality;


const ensureDirectory = function(filePath) {
    var dirName = path.dirname(filePath);
    if (fs.existsSync(dirName)) {
        return;
    } else {
        fs.mkdirSync(dirName, { recursive: true });
    }
}

const isResponsive = function(filePath) {
    var fileName = path.basename(filePath);
    return /@picture|@responsive/i.test(fileName);
}

const clearResponsive = function(filePath) {
    var fileName = path.basename(filePath);
    return fileName.replace(/@picture|@responsive/ig, '');
}

const maxWidthOperation = function(metadata, maxWidth) {
    if (maxWidth > 0) {
        let options = {};
        options.width = maxWidth;
        options.fit = 'inside';
        operation = { name: 'resize', arguments: [options] };
        return operation;
    }
}

const jpegQualityOperation = function(metadata) {
    if (metadata.format == 'jpeg' && QUALITY) {
        return { name: 'jpeg', arguments: [{ quality: QUALITY }] };
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
    let jpegQuality = jpegQualityOperation(metadata);
    if (jpegQuality) {
        operations.push(jpegQuality);
    }
    return operations;
}


const responsiveImages = async function(file, encoding, callback) {

    let image = sharp(file.contents);

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
                file.basename = clearResponsive(file.basename);
                ensureDirectory(`${DEST}${file.relative}`);

                optimize(metadata, site.responsiveImages.lgWidth, '-lg');
                optimize(metadata, site.responsiveImages.mdWidth, '-md');
                optimize(metadata, site.responsiveImages.rgWidth, '-rg');
                optimize(metadata, site.responsiveImages.smWidth, '-sm');
            }
            //do nothing
            callback(null, file);

        }).catch(imageError => {
            console.log('Error with ' + file.relative);
            console.log(imageError);
            callback(null, file);
        });
}

const singleImage = async function(file, encoding, callback) {

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
        if (isResponsive(file.basename)) {
            responsiveImages(file, encoding, callback);
        } else {
            singleImage(file, encoding, callback);
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