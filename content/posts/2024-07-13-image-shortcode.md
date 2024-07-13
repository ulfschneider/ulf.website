---
title: Image shortcode
tags: code
draft: true
---

```js
//transforms.js
const path = require("path");
const Image = require("@11ty/eleventy-img");
const fs = require("fs");

const SITE_INPUT = "src";
const SITE_OUTPUT = "_site";
const IMAGE_FORMATS = ["webp", "auto"];
const IMAGE_WIDTHS = [400, 900, 1280, null];
const IMAGE_SIZES = "100vw";

function allImageTags (html) {
	if (html) {
	  const matches = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/gi);
	  if (matches) {
	    return matches;
	  } else {
	    return [];
	  }
	}
}

function getAttr (html, attr) {
  if (html) {
    const match = html.match(new RegExp(`${attr}="(.*?)"`, "i"));
    if (match) {
      return match[1];
    }
  }
}

function srcAttr (html) {
  return getAttr(html, "src");
}

function altAttr (html) {
  return getAttr(html, "alt");
}

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

module.exports = {
  imageTransform: async function (content, contentPath) {
    const images = allImageTags(content);

    for (const imgTag of images) {
      const src = srcAttr(imgTag);
      const alt = altAttr(imgTag);
      const { name, dir, base, ext } = path.parse(src);

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
  }
};

```



```js
//eleventy.js
function addTransforms(eleventyConfig) {
  eleventyConfig.addTransform("imageTransform", transforms.imageTransform);
}
```
