const { dest, src } = require("gulp");
const utils = require("../_eleventy/utils.js");
const site = require("../_data/site.js");
const SOURCE = ["_assets/fonts/**/*"];
const DEST = `${site.output}${utils.getBase()}fonts/`;

const processingFonts = () => {
  console.log(`Copying fonts from ${SOURCE} into ${DEST}`);
  return src(SOURCE).pipe(dest(DEST));
};

module.exports = processingFonts;
