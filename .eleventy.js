const dotenv = require("dotenv");
dotenv.config();

const { minify } = require("terser");
const CleanCSS = require("clean-css");
const rss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const embedTweets = require("eleventy-plugin-embed-tweet");
const webmentions = require("eleventy-plugin-webmentions");
const site = require("./_data/site.js");
const utils = require("./_eleventy/utils.js");
const filters = require("./_eleventy/filters.js");

const fs = require("fs");
const liteYTJs = fs.readFileSync(
  "node_modules/lite-youtube-embed/src/lite-yt-embed.js"
);
const liteYTCss = fs.readFileSync(
  "node_modules/lite-youtube-embed/src/lite-yt-embed.css"
);

module.exports = function (eleventyConfig) {
  addLayoutAliases(eleventyConfig);
  addCollections(eleventyConfig);
  addFilters(eleventyConfig);
  addMarkdownLib(eleventyConfig);

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setTemplateFormats(["md", "html", "njk"]);

  eleventyConfig.addPassthroughCopy({ "content/assets": "/assets" });

  eleventyConfig.addPlugin(rss);
  eleventyConfig.addLiquidFilter("dateToRfc3339", rss.dateToRfc3339);
  eleventyConfig.addLiquidFilter("dateToRfc822", rss.dateToRfc822);

  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      // Added in 4.1.0 you can use callback functions too
      "data-language": function ({ language, content, options }) {
        return language;
      },
    },
    codeAttributes: {},
  });
  eleventyConfig.addPlugin(embedTweets, {
    cacheDirectory: "_tweets" /* Cache tweets in the _tweets folder */,
    useInlineStyles: true /*use the default styling*/,
    autoEmbed: true /*allow to embed a tweet by writing the URL within a single line in your Markdown */,
  });

  if (site.allowWebmentions) {
    eleventyConfig.addPlugin(webmentions, {
      domain: site.domain,
      token: process.env.WEBMENTION_PAT,
      cacheDirectory: "_webmentions",
    });
  }

  //lite-youtube
  eleventyConfig.addTransform("lite-youtube", async function (content) {
    let found = false;

    function replaceHTMLWithLiteYoutube(content, index, length, videoId) {
      return (
        content.substring(0, index) +
        `<lite-youtube videoid="${videoId}"></lite-youtube>` +
        content.substring(index + length)
      );
    }

    async function hydrateLiteYoutube(content) {
      const liteYTStyles = new CleanCSS({}).minify(liteYTCss.toString()).styles;
      const liteYTCode = (
        await minify(liteYTJs.toString(), {
          mangle: {
            toplevel: true,
          },
          nameCache: {},
        })
      ).code;

      content += `\n<style>${liteYTStyles}</style>`;
      content += `\n<script>${liteYTCode}</script>`;
      return content;
    }

    const IFRAME =
      /<iframe\s+src=".*?(youtube.com|youtu.be)\/(embed\/|watch\?v=)?(?<videoId>.*?)(\?|").*?<\/iframe>/i;
    const SINGLE_LINE =
      /<p ?.*?>\s*(http(s)?:\/\/)?(www.)?(youtube.com|youtu.be)\/(embed\/|watch\?v=)?(?<videoId>.*?)(\?)?\s*<\/p>/i;
    const PATTERN = [IFRAME, SINGLE_LINE];

    for (const pattern of PATTERN) {
      while ((match = content.match(pattern))) {
        found = true;
        content = replaceHTMLWithLiteYoutube(
          content,
          match.index,
          match[0].length,
          match.groups.videoId
        );
      }
    }

    if (found) {
      content = await hydrateLiteYoutube(content);
    }

    return content;
  });

  return {
    dir: {
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: site.output,
    },
  };
};

function addMarkdownLib(eleventyConfig) {
  eleventyConfig.setLibrary("md", utils.getMarkdownLib());
}

function addLayoutAliases(eleventyConfig) {
  eleventyConfig.addLayoutAlias("default", "default.html");
  eleventyConfig.addLayoutAlias("list", "list.html");
  eleventyConfig.addLayoutAlias("image", "default.html");
  eleventyConfig.addLayoutAlias("gallery", "gallery.html");
  eleventyConfig.addLayoutAlias("blank", "blank.html");
  eleventyConfig.addLayoutAlias("none", "none.html");
  eleventyConfig.addLayoutAlias("feed", "feed.njk");
  eleventyConfig.addLayoutAlias("search", "search.html");
}

function addCollections(eleventyConfig) {
  //live content
  eleventyConfig.addCollection("liveContent", (collectionAPI) => {
    console.log("Derive live content");
    return collectionAPI
      .getFilteredByGlob([
        "content/**",
        "!content/tagintros/**",
        "!content/api/**",
      ])
      .filter(utils.isLiveItem)
      .map((item) => {
        item.data.indicateModifiedDate = filters.indicateModifiedDate(item);
        item.data.modifiedDate = filters.modifiedDate(item);

        return item;
      })
      .sort(utils.compareItemDate)
      .reverse();
  });
  //tag intros
  eleventyConfig.addCollection("tagIntros", (collectionAPI) => {
    console.log("Derive tag intros");
    return collectionAPI
      .getFilteredByGlob("content/tagintros/**")
      .map((item) => {
        item.data.indicateModifiedDate = filters.indicateModifiedDate(item);
        item.data.modifiedDate = filters.modifiedDate(item);
        return item;
      });
  });
  //double pagination
  eleventyConfig.addCollection("doublePagination", (collectionAPI) => {
    console.log("Derive double pagination");
    let items = collectionAPI
      .getFilteredByGlob("content/posts/**")
      .map((item) => {
        if (item.data?.tags?.includes(site.starTag)) {
          item.data.starred = site.starTag;
        } else {
          item.data.starred = "";
        }
        return item;
      })
      .filter(utils.isLiveItem)
      .filter(utils.isPost)
      .sort(utils.compareItemDate)
      .reverse();

    let tagMap = [];
    let pagedItems = utils.chunk(items, site.paginationSize);
    for (
      let pageNumber = 0, max = pagedItems.length;
      pageNumber < max;
      pageNumber++
    ) {
      tagMap.push({
        tag: "",
        title: "All posts",
        pageNumber: pageNumber,
        humanPageNumber: pageNumber + 1,
        permalink: utils.currentPage(site.blog, pageNumber),
        newest: utils.currentPage(site.blog),
        newer: utils.newerPage(site.blog, pageNumber),
        older: utils.olderPage(site.blog, pageNumber, max),
        oldest: utils.oldestPage(site.blog, max),
        itemCount: items.length,
        pageCount: pagedItems.length,
        pageData: pagedItems[pageNumber],
      });
    }

    let usedSiteTags = utils.extractTags(items);
    for (let tagName of usedSiteTags) {
      let tagItems = items.filter((item) => item.data?.tags?.includes(tagName));
      let pagedItems = utils.chunk(tagItems, site.paginationSize);

      for (
        let pageNumber = 0, max = pagedItems.length;
        pageNumber < max;
        pageNumber++
      ) {
        tagMap.push({
          tag: tagName,
          pageNumber: pageNumber,
          humanPageNumber: pageNumber + 1,
          permalink: utils.currentPage(`${site.blog}${tagName}/`, pageNumber),
          newest: utils.currentPage(`${site.blog}${tagName}/`),
          newer: utils.newerPage(`${site.blog}${tagName}/`, pageNumber),
          older: utils.olderPage(`${site.blog}${tagName}/`, pageNumber, max),
          oldest: utils.oldestPage(`${site.blog}${tagName}/`, max),
          itemCount: tagItems.length,
          pageCount: pagedItems.length,
          pageData: pagedItems[pageNumber],
        });
      }
    }

    return tagMap;
  });
}

function addFilters(eleventyConfig) {
  eleventyConfig.addFilter("searchIndex", filters.searchIndex);
  eleventyConfig.addFilter("siteTags", filters.siteTags);
  eleventyConfig.addFilter("hasTag", filters.hasTag);
  eleventyConfig.addFilter("tagUrl", filters.tagUrl);
  eleventyConfig.addFilter("tagColor", filters.tagColor);
  eleventyConfig.addFilter("firstImage", filters.firstImage);
  eleventyConfig.addFilter("live", filters.live);
  eleventyConfig.addFilter("post", filters.post);
  eleventyConfig.addFilter("isPost", filters.isPost);
  eleventyConfig.addFilter("tagIntro", filters.tagIntro);
  eleventyConfig.addFilter("humanDate", filters.humanDate);
  eleventyConfig.addFilter("humanDateTime", filters.humanDateTime);
  eleventyConfig.addFilter("isoDate", filters.isoDate);
  eleventyConfig.addFilter("responsiveHero", filters.responsiveHero);
  eleventyConfig.addFilter("imgAspectRatio", filters.imgAspectRatio);
  eleventyConfig.addFilter("authorEmail", filters.authorEmail);
  eleventyConfig.addFilter("authorName", filters.authorName);
  eleventyConfig.addFilter(
    "indicateModifiedDate",
    filters.indicateModifiedDate
  );
  eleventyConfig.addFilter("modifiedDate", filters.modifiedDate);
  eleventyConfig.addFilter(
    "commentRootIssueNumber",
    filters.commentRootIssueNumber
  );
  eleventyConfig.addFilter("comments", filters.comments);
  eleventyConfig.addFilter("withComments", filters.withComments);
}
