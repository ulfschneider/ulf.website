const path = require("path");
const Image = require("@11ty/eleventy-img");
const site = require("../_data/site.js");
const utils = require("../_eleventy/utils.js");
const fs = require("fs");

const SITE_INPUT = site.input || "src";
const SITE_OUTPUT = site.output || "_site";
const IMAGE_FORMATS = site.images?.formats || ["webp", "auto"];
const IMAGE_WIDTHS = site.images?.widths || [400, 900, 1280, null];
const IMAGE_SIZES = site.images?.sizes || "100vw";

module.exports = {
  imageTransform: async function (content, contentPath) {
    const images = utils.allImageTags(content);

    for (const imgTag of images) {
      const src = utils.srcAttr(imgTag);
      const alt = utils.altAttr(imgTag);
      const { name, dir, base, ext } = path.parse(src);

      function getOrigImageMetaData(imageMetaData) {
        const formats = Object.keys(imageMetaData);
        for (const format of formats) {
          if (!IMAGE_FORMATS.includes(format)) {
            //a format that is not described explicitly in the IMAGE_FORMATS
            //must be the original format
            return imageMetaData[format].at(-1);
          }
        }

        const lext = ext.toLowerCase().replace(/^\./, "");
        if (lext == "jpg" || lext == "jpeg") {
          return imageMetaData.jpeg?.at(-1);
        } else {
          return imageMetaData[lext]?.at(-1);
        }
      }

      try {
        const imageMetaData = await Image(path.join(SITE_INPUT, src), {
          widths: IMAGE_WIDTHS,
          formats: IMAGE_FORMATS,
          outputDir: path.join(SITE_OUTPUT, dir, name),
          urlPath: path.join(dir, name),
          filenameFormat: function (hash, src, width, format, options) {
            return `${name}-${width}.${format}`;
          },
        });

        content = content.replace(
          imgTag,
          Image.generateHTML(imageMetaData, {
            loading: "lazy",
            decoding: "async",
            alt: alt || "",
            sizes: IMAGE_SIZES,
          })
        );

        const origImageMetaData = getOrigImageMetaData(imageMetaData);
        if (origImageMetaData) {
          fs.copyFileSync(
            origImageMetaData.outputPath,
            path.join(SITE_OUTPUT, dir, base)
          );
        }
      } catch (error) {
        console.error("Failure transforming", src, error);
      }
    }

    return content;
  },
};
