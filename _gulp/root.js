const { dest, src } = require("gulp");

const minify = require("gulp-minify");
const replace = require("./replace.js");
const site = require("../_data/site.js");
const utils = require("../_eleventy/utils.js");
const SOURCE = ["_root/**/*"];
const DEST = `${site.output}${utils.getBase()}`;

const processingRoot = () => {
  console.log(`Processing root from ${SOURCE} into ${DEST}`);
  return src(SOURCE)
    .pipe(replace())
    .pipe(
      minify({
        ext: {
          min: ".js",
        },
        noSource: true,
      })
    )
    .pipe(dest(DEST));
};

module.exports = processingRoot;
