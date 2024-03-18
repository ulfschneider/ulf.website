const clean = require("./_gulp/clean.js");
const fonts = require("./_gulp/fonts.js");
const css = require("./_gulp/css.js");
const javascript = require("./_gulp/javascript.js");
const root = require("./_gulp/root.js");

const { series, watch } = require("gulp");

const site = require("./_data/site.js");

const watcher = () => {
  watch(["_assets/fonts/**/*"], fonts);
  watch(
    [
      "_assets/**/*",
      "_includes/**/*",
      "_data/site.js",
      "_layouts/**/*",
      "_eleventy/**/*",
      "content/**/*",
      "tailwind.config.js",
    ],
    css
  );
  watch(["_assets/js/**/*"], javascript);
  watch(["_root/**/*"], root);
};

exports.default = series([clean, root, javascript, css, fonts]);

exports.watch = watcher;
