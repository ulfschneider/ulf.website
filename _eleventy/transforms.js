const path = require("node:path");
const Image = require("@11ty/eleventy-img");
const site = require("../_data/site.js");
const utils = require("../_eleventy/utils.js");

module.exports = {
  imageTransform: async function (content, contentPath) {
    const images = utils.allImageTags(content);
    for (const imgTag of images) {
      const src = utils.srcAttr(imgTag);
      const alt = utils.altAttr(imgTag);
      const { name, dir } = path.parse(src);

      try {
        const imageMetaData = await Image(path.join(site.input, src), {
          widths: [400, 900, 1280, null],
          formats: ["webp", null],
          outputDir: path.join(site.output, dir, name),
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
            sizes: "100vw",
          })
        );
      } catch (error) {
        console.error("Failure transforming", src, error);
      }
    }

    return content;
  },
};
