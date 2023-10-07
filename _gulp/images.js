const { dest, src } = require("gulp");
const sharp = require("sharp");
const svgo = require("gulp-svgo");
const through = require("through2");
const fs = require("fs");
const path = require("path");
const site = require("../_data/site.js");
const utils = require("../_eleventy/utils.js");
const SOURCE = [`${site.input}${utils.getBase()}img/**/*`, `_assets/img/**/*`];
const DEST = `${site.output}${utils.getBase()}img/`;

const MAX_WIDTH = site.imgMaxWidth;
const MAX_HEIGHT = site.imgMaxHeight;
const SMALL_WIDTH = site.imgSmallWidth;
const SMALL_HEIGHT = site.imgSmallHeight;
const QUALITY = site.imgQuality;

const qualityOperation = function (metadata) {
  if (metadata.format == "jpeg" && QUALITY) {
    return { name: "jpeg", arguments: [{ quality: QUALITY }] };
  } else if (metadata.format == "webp" && QUALITY) {
    return { name: "webp", arguments: [{ quality: QUALITY }] };
  }
};

const deriveOperations = function (metadata, file) {
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

  if (
    (maxWidth > 0 && metadata.width > maxWidth) ||
    (maxHeight > 0 && metadata.height > maxHeight)
  ) {
    let options = {};
    if (maxWidth > 0 && metadata.width > maxWidth) {
      options.width = maxWidth;
    }
    if (maxHeight > 0 && metadata.height > maxHeight) {
      options.height = maxHeight;
    }
    options.fit = "inside";
    operations.push({ name: "resize", arguments: [options] });
  }
  let quality = qualityOperation(metadata);
  if (quality) {
    operations.push(quality);
  }
  return operations;
};

const smallOperation = function (metadata) {
  if (metadata.width > SMALL_WIDTH || metadata.height > SMALL_HEIGHT) {
    let options = {};
    if (metadata.width > SMALL_WIDTH) {
      options.width = SMALL_WIDTH;
    }
    if (metadata.height > SMALL_HEIGHT) {
      options.height = SMALL_HEIGHT;
    }
    options.fit = "inside";
    return { name: "resize", arguments: [options] };
  }
};

const webpFormat = async function (file, encoding, callback) {
  let image = sharp(file.contents);
  return image
    .metadata()
    .then(async (metadata) => {
      if (
        metadata.format != "webp" &&
        metadata.format != "gif" &&
        metadata.format != "svg"
      ) {
        image = await image.webp({ lossless: true });
        let operations = deriveOperations(metadata, file);
        for (let op of operations) {
          image = await image[op.name].apply(image, op.arguments);
        }
        await image.toBuffer((err, buffer) => {
          let stem = utils.clearResponsive(file.stem);
          let relative = file.relative.replace(file.basename, stem + ".webp");
          console.log(`Writing ${DEST}${relative}`);
          utils.ensureDirectory(`${DEST}${relative}`);
          fs.writeFileSync(`${DEST}${relative}`, buffer);
        });
      }
    })
    .catch((imageError) => {
      console.log("Error with " + file.relative);
      console.log(imageError);
      callback(null, file);
    });
};

const keepFormat = async function (file, encoding, callback) {
  let image = sharp(file.contents);
  return image
    .metadata()
    .then(async (metadata) => {
      if (metadata.format != "gif" && metadata.format != "svg") {
        let operations = deriveOperations(metadata, file);
        for (let op of operations) {
          image = await image[op.name].apply(image, op.arguments);
        }
        let stem = utils.clearResponsive(file.stem);
        await image.toBuffer((err, buffer) => {
          let relative = file.relative.replace(
            file.basename,
            stem + file.extname
          );
          console.log(`Writing ${DEST}${relative}`);
          utils.ensureDirectory(`${DEST}${relative}`);
          fs.writeFileSync(`${DEST}${relative}`, buffer);
        });
        let small = smallOperation(metadata);
        if (small) {
          image = await image[small.name].apply(image, small.arguments);
          await image.toBuffer((err, buffer) => {
            let relative = file.relative.replace(
              file.basename,
              stem + site.imgSmallPostfix + file.extname
            );
            console.log(`Writing ${DEST}${relative}`);
            utils.ensureDirectory(`${DEST}${relative}`);
            fs.writeFileSync(`${DEST}${relative}`, buffer);
          });
        }
      }
    })
    .catch((imageError) => {
      console.log("Error with " + file.relative);
      console.log(imageError);
      callback(null, file);
    });
};

const imageTransformer = async function (file, encoding, callback) {
  if (!file.isNull()) {
    await keepFormat(file, encoding, callback);
    if (utils.isResponsive(file.basename)) {
      await webpFormat(file, encoding, callback);
    }
  }
  callback(null, file);
};

const processingImages = () => {
  console.log(`Processing images from ${SOURCE} into ${DEST}`);
  console.log(
    `imgMaxWidth=${MAX_WIDTH}, imgMaxHeight=${MAX_HEIGHT}, and jpegQuality=${QUALITY} (0-100).`
  );
  console.log(
    `Change these settings in _data/site.js if desired. GIF files are ignored to be optimized.`
  );

  return src(SOURCE, { nodir: true })
    .pipe(through.obj(imageTransformer))
    .pipe(svgo())
    .pipe(dest(DEST));
};

module.exports = processingImages;
