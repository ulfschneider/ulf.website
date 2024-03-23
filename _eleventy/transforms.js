const path = require("node:path");
const Image = require("@11ty/eleventy-img");
const site = require("../_data/site.js");
const utils = require("../_eleventy/utils.js");

const SITE_INPUT = site.input || "src";
const SITE_OUTPUT = site.output || "_site";
const IMAGE_FORMATS = site.images?.formats || ["webp", "auto"];
const IMAGE_WIDTHS = site.images?.widths || [400, 900, 1280, "auto"];
const IMAGE_SIZES = site.images?.sizes || "100vw";

module.exports = {
  imageTransform: async function (content, contentPath) {
    const images = utils.allImageTags(content);

    for (const imgTag of images) {
      const src = utils.srcAttr(imgTag);
      const alt = utils.altAttr(imgTag);
      const { name, dir } = path.parse(src);

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
      } catch (error) {
        console.error("Failure transforming", src, error);
      }
    }

    return content;
  },
};
