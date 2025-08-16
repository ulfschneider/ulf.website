import chalk from "chalk";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventySyntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import feedPlugin from "@11ty/eleventy-plugin-rss";
import { execSync } from "node:child_process";
import through from "through2";
import path from "node:path";
import { capitalize } from "lodash-es";
import { minify } from "terser";
import markdownItDeflist from "markdown-it-deflist";
import markdownItMark from "markdown-it-mark";
import markdownItRSSFriendlyGitHubAlerts from "markdown-it-rss-friendly-github-alerts";
import markdownItTableOfContents from "markdown-it-table-of-contents";
import markdownItCollapsible from "markdown-it-collapsible";
import markdownItAnchor from "markdown-it-anchor";
import markdownItTrimmer from "markdown-it-trimmer";
import markdownItScrolltable from "markdown-it-scrolltable";
import markdownItFootnote from "markdown-it-footnote";
import markdownItCooklang from "markdown-it-cooklang";
import markdownItAttrs from "markdown-it-attrs";
import markdownItFitVids from "markdown-it-fitvids";
import markdownItMermaidServer from "markdown-it-mermaid-server";
import markdownItEcharts from "markdown-it-responsive-echarts";
import { full as markdownItEmoji } from "markdown-it-emoji";
import markdownItMathjax from "markdown-it-mathjax3";
import markdownItContainer from "markdown-it-container";

import site from "./_code/_data/site.mjs";
import {
  sortTags,
  getItemsByTagAndYear,
  isLive,
  openGraphImage,
  getImagesByTag,
  isGallery,
} from "./_code/_11ty/collections.mjs";
import prismLanguages from "./_code/_data/prism-languages.mjs";
import dayjs from "dayjs";

import resolveConfig from "./node_modules/tailwindcss/resolveConfig.js";
import myTailwindConfig from "./tailwind.config.js";

const tailwindConfig = resolveConfig(myTailwindConfig);

export default async function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    //dev server options

    // Whether DOM diffing updates are applied where possible instead of page reloads
    domDiff: false,
    // Additional files to watch that will trigger server updates
    // Accepts an Array of file paths or globs (passed to `chokidar.watch`).
    // Works great with a separate bundler writing files to your output folder.
    // e.g. `watch: ["_site/**/*.css"]`
    watch: ["tailwind.config.js"],
  });

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setTemplateFormats(["md", "html", "njk"]);
  eleventyConfig.addPassthroughCopy({ "content/assets": "assets" });

  eleventyConfig.addPassthroughCopy(
    { "_code/_fonts": "fonts" },
    {
      overwrite: true,
      rename: (filePath) => {
        if (!path.basename(filePath)) {
          return filePath;
        }

        return (
          path.basename(filePath, path.extname(filePath)) +
          site.cache.version.font +
          path.extname(filePath)
        );
      },
    },
  );
  eleventyConfig.addPassthroughCopy(
    { "_code/_css/": "css" },
    {
      overwrite: true,
      filter: ["style.css"],
      transform: (src, dest, stats) => {
        return through((chunk, enc, done) => {
          let content = chunk.toString();

          //get the site data settings into the service worker

          content = content.replace(
            /\{\{site.cache.version.font\}\}/gi,
            site.cache.version.font,
          );

          done(null, content);
        });
      },
      rename: (filePath) => {
        if (!path.basename(filePath)) {
          return filePath;
        }

        return `style${site.cache.version.css}.css`;
      },
    },
  );

  eleventyConfig.addPassthroughCopy(
    { "_code/_js/": "js" },
    {
      overwrite: true,
      transform: (src, dest, stats) => {
        if (path.extname(src) != ".js" && path.extname(src) != ".mjs") {
          return null;
        }

        return through((chunk, enc, done) => {
          let content = chunk.toString();
          content = content.replace(
            /\{\{site.cache.version.script\}\}/g,
            site.cache.version.script,
          );
          minify(content).then((result) => done(null, result.code));
        });
      },
      rename: (filePath) => {
        if (!path.basename(filePath)) {
          return filePath;
        }

        return (
          path.basename(filePath, path.extname(filePath)) +
          site.cache.version.script +
          path.extname(filePath)
        );
      },
    },
  );

  eleventyConfig.addPassthroughCopy(
    { "_code/_root": "." },
    {
      overwrite: true,
      transform: (src, dest, stats) => {
        if (path.extname(src) != ".js" && path.extname(src) != ".mjs") {
          return null;
        }

        return through((chunk, enc, done) => {
          let content = chunk.toString();

          //get the site data settings into the service worker
          content = content.replace(
            /let site = \{\};/,
            `let site = ${JSON.stringify(site)};`,
          );
          minify(content).then((result) => done(null, result.code));
        });
      },
    },
  );

  eleventyConfig.addPassthroughCopy("img");

  eleventyConfig.addLayoutAlias("default", "default.html");
  eleventyConfig.addLayoutAlias("image", "default.html");
  eleventyConfig.addLayoutAlias("bookmark", "default.html");
  eleventyConfig.addLayoutAlias("blog", "blog.html");
  eleventyConfig.addLayoutAlias("gallery", "gallery.html");
  eleventyConfig.addLayoutAlias("about", "about.html");
  eleventyConfig.addPlugin(eleventySyntaxHighlightPlugin, {
    preAttributes: {
      // Added in 4.1.0 you can use callback functions too
      "data-language": function ({ language, content, options }) {
        return resolvePrismLanguage(language);
      },
    },
    codeAttributes: {},
  });
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "svg"],

    sharpOptions: {
      animated: true,
      limitInputPixels: false,
    },

    // output image widths
    widths: [200, "auto"],

    sharpOptions: {
      animated: true,
    },

    // optional, attributes assigned on <img> nodes override these values
    htmlOptions: {
      imgAttributes: {
        alt: "",
        loading: "lazy",
        sizes: "100vw",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  eleventyConfig.addPlugin(feedPlugin);

  let markdownLib;
  eleventyConfig.amendLibrary("md", async (mdLib) => {
    markdownLib = mdLib;
    mdLib.disable("code");
    mdLib.use(markdownItDeflist);
    mdLib.use(markdownItMark);
    mdLib.use(markdownItRSSFriendlyGitHubAlerts);
    mdLib.use(markdownItAnchor);
    mdLib.use(markdownItCollapsible);
    mdLib.use(markdownItTableOfContents, {
      listType: "ol",
      includeLevel: [2, 3],
    });
    mdLib.use(markdownItTrimmer);
    mdLib.use(markdownItContainer);
    mdLib.use(markdownItEmoji);
    mdLib.use(markdownItMathjax);
    mdLib.use(markdownItScrolltable);

    eleventyConfig.ignores.add("_mermaidTmp/");
    mdLib.use(markdownItMermaidServer, {
      workingFolder: "_mermaidTmp",
      clearWorkingFolder: true,
      throwOnError: true,
    });

    /*
    mdLib.use(markdownItChartJs, {
      verbose: true,
      defaults: {
        font: {
          size: 18,
          family: "'iA Writer Quattro', system-ui, sans-serif",
        },
      },
    });*/

    mdLib.use(markdownItEcharts, {
      defaults: {
        color: [
          "#007affa0",
          "#ffa500a0",
          "#008000a0",
          "#9370DBa0",
          "#FFD700a0",
          "#ff0000a0",
        ],
        renderOptions: {
          renderer: "svg",
        },
        aria: {
          show: true,
        },
        toolbox: {
          feature: {
            restore: {},
            saveAsImage: {},
            dataView: {},
          },
        },
        title: {
          textStyle: {
            fontFamily: "'iA Writer Quattro', system-ui, sans-serif",
            fontSize: 18,
            color: "#262626",
          },
        },
        legend: {
          textStyle: {
            fontFamily: "'iA Writer Quattro', system-ui, sans-serif",
            fontSize: 18,
            color: "#262626",
          },
        },
        textStyle: {
          fontFamily: "'iA Writer Quattro', system-ui, sans-serif",
          fontSize: 18,
          color: "#262626",
        },
        series: {
          label: {
            textStyle: {
              fontFamily: "'iA Writer Quattro', system-ui, sans-serif",
              fontSize: 18,
              color: "#262626",
            },
          },
          markPoint: {
            label: {
              textStyle: {
                fontFamily: "'iA Writer Quattro', system-ui, sans-serif",
                fontSize: 18,
                color: "#262626",
              },
            },
          },
        },
        darkModeConfig: {
          title: {
            textStyle: {
              color: "#c3c3c3",
            },
          },
          textStyle: {
            color: "#c3c3c3",
          },
          legend: {
            textStyle: {
              color: "#c3c3c3",
            },
          },
          xAxis: {
            axisLine: {
              lineStyle: {
                color: "#888",
              },
            },
            markLine: {
              lineStyle: {
                color: "#888",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#888",
              },
            },
          },
          yAxis: {
            axisLine: {
              lineStyle: {
                color: "#888",
              },
            },
            markLine: {
              lineStyle: {
                color: "#888",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#888",
              },
            },
          },
          series: {
            label: {
              textStyle: {
                color: "#c3c3c3",
              },
            },
            markLine: {
              lineStyle: {
                color: "#888",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#888",
              },
            },
            markPoint: {
              label: {
                textStyle: {
                  color: "#c3c3c3",
                },
              },
            },
          },
        },
      },
    });

    mdLib.use(markdownItFootnote);
    //customizing how footnote captions appear in the text
    mdLib.renderer.rules.footnote_caption = (
      tokens,
      idx /*, options, env, slf */,
    ) => {
      let n = Number(tokens[idx].meta.id + 1).toString();

      if (tokens[idx].meta.subId > 0) n += `:${tokens[idx].meta.subId}`;

      return n;
    };

    mdLib.use(markdownItAttrs);
    mdLib.use(markdownItFitVids, {
      applyStyle: ` width:${tailwindConfig.theme.maxWidth.prose};`,
    });
    mdLib.use(markdownItCooklang, {
      cookware: {
        startWith: "+", //do not interfere with the #, which is used for tags in iA Writer
      },
    });
  });

  eleventyConfig.addFilter("markdown", (content) =>
    content ? markdownLib.render(content) : "",
  );
  eleventyConfig.addFilter("markdown_inline", (content) =>
    content ? markdownLib.renderInline(content) : "",
  );
  eleventyConfig.addFilter("iso_date", (date) => dayjs(date).format());
  eleventyConfig.addFilter("capitalize", (value) => capitalize(value));
  eleventyConfig.addFilter("adjust_tag_label", (tag) => {
    if (tag == site.tags.star) {
      return "❤️";
    } else if (tag == "") {
      return "All posts";
    } else {
      return "#" + tag;
    }
  });
  eleventyConfig.addFilter("adjust_tag_path", (tag) => {
    if (isGallery(tag)) {
      if (tag) {
        return `/gallery/${tag}/`;
      } else {
        return "/gallery/";
      }
    } else {
      if (tag) {
        return `/blog/${tag}/`;
      } else {
        return "/blog/";
      }
    }
  });
  eleventyConfig.addFilter("og_image", (html) => openGraphImage(html));
  eleventyConfig.addFilter("strip_quotes", (content) =>
    content.replace(/"|'/gi, ""),
  );
  eleventyConfig.addFilter("item_from_url", (collection, url) => {
    for (const item of collection) {
      if (item.page.url == url) {
        return item;
      }
    }
  });
  eleventyConfig.addShortcode("first_image", (post) =>
    extractFirstImageTag(post.templateContent),
  );

  eleventyConfig.addCollection("livePosts", (collectionsApi) => {
    //all live posts
    return collectionsApi
      .getAllSorted()
      .filter((item) => isLive(item))
      .reverse();
  });

  eleventyConfig.addCollection("rssPosts", (collectionsApi) => {
    //all live posts
    return [
      ...collectionsApi
        .getAllSorted()
        .filter((item) => isLive(item) && item.data.rss)
        .reverse(),
    ].slice(0, 50);
  });

  eleventyConfig.addCollection("siteTags", (collectionsApi) => {
    //all live posts
    const tags = new Set();
    collectionsApi
      .getAllSorted()
      .filter((item) => isLive(item))
      .map((item) => {
        if (item.data.tags?.length) {
          tags.add(...item.data.tags);
        }
      });

    return sortTags(["", ...tags]);
  });

  eleventyConfig.addCollection("postsByTagAndYear", (collectionsApi) => {
    //all live posts
    const livePosts = collectionsApi
      .getAllSorted()
      .filter((item) => isLive(item))
      .reverse();

    const postsByTagAndYear = getItemsByTagAndYear(
      livePosts,
      collectionsApi,
      markdownLib,
    );

    return postsByTagAndYear;
  });

  eleventyConfig.addCollection("imagesByTag", (collectionsApi) => {
    const livePosts = collectionsApi
      .getAllSorted()
      .filter((item) => isLive(item))
      .reverse();

    const imagesByTag = getImagesByTag(livePosts, collectionsApi, markdownLib);

    return imagesByTag;
  });

  eleventyConfig.addCollection("recentNotes", (collectionsApi) => {
    let recentPublishedDate;
    return collectionsApi
      .getAllSorted()
      .reverse()
      .filter((item) => {
        if (!isLive(item)) {
          return false;
        }
        if (!recentPublishedDate) {
          recentPublishedDate = dayjs(item.data.publishedDate).format(
            "YYYY-MM-DD",
          );
          return true;
        } else if (
          recentPublishedDate ==
          dayjs(item.data.publishedDate).format("YYYY-MM-DD")
        ) {
          return true;
        } else {
          return false;
        }
      });
  });

  eleventyConfig.on(
    "eleventy.before",
    ({ dir, results, runMode, outputMode }) => {
      console.log(
        chalk.cyan.bold(
          "******** eleventy before build event, configured in .eleventy.js config file",
        ),
      );
      prepareTailwind();
    },
  );

  eleventyConfig.on(
    "eleventy.after",
    async ({ dir, results, runMode, outputMode }) => {
      console.log(
        chalk.cyan.bold(
          "******** eleventy after build event, configured in .eleventy.js config file",
        ),
      );
      preparePagefind();
    },
  );
}

function preparePagefind() {
  execSync(`npx pagefind --site ${config.dir.output}`, {
    cwd: "./",
    encoding: "utf-8",
    stdio: "inherit",
  });
}

function prepareTailwind() {
  console.log(chalk.cyan.bold("\nPrepare Tailwind CSS"));
  execSync("npm run build:css", {
    cwd: "./",
    encoding: "utf-8",
    stdio: "inherit",
  });
}

export const config = {
  dir: {
    data: "_code/_data",
    includes: "_code/_includes",
    layouts: "_code/_layouts",
    output: "_site",
  },
};

function resolvePrismLanguage(language) {
  if (language.startsWith("diff-")) {
    language = language.substring(5);
  } else if (language == "diff") {
    language = "";
  }
  return prismLanguages[language] || language || "";
}
