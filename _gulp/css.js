const { dest, src } = require("gulp");
const postcss = require("gulp-postcss");
const postcssImport = require("postcss-import");
const tailwindCSSNesting = require("tailwindcss/nesting");
const tailwindCSS = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const postcssHexRgba = require("postcss-hexrgba");
const postcssCustomMedia = require("postcss-custom-media");
const postcssCustomProperties = require("postcss-custom-properties");
const postcssCalc = require("postcss-calc");
const cssNano = require("cssnano");
const rename = require("gulp-rename");

const replace = require("./replace.js");
const site = require("../_data/site.js");
const utils = require("../_eleventy/utils.js");

const SOURCE = ["_assets/css/main.css"];
const DEST = `${site.output}${utils.getBase()}css/`;

const processingCSS = () => {
  console.log(`Processing CSS from ${SOURCE} into ${DEST}`);
  return src(SOURCE)
    .pipe(
      postcss([
        postcssImport(),
        tailwindCSSNesting(),
        tailwindCSS("tailwind.config.js"),
        autoprefixer(),
        postcssCustomMedia(),
        postcssCustomProperties({ preserve: false }),
        postcssCalc(),
        postcssHexRgba(),
        cssNano(),
      ])
    )
    .pipe(replace())
    .pipe(
      rename(function (path) {
        path.basename += `-${site.cacheVersioning.css}`;
      })
    )
    .pipe(dest(DEST));
};

module.exports = processingCSS;
