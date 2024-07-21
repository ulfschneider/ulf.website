const markdownIt = require("markdown-it");
const slugify = require("slugify");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItTocDoneRight = require("markdown-it-toc-done-right");
const markdownItDefList = require("markdown-it-deflist");
const markdownItContainer = require("markdown-it-container");
const markdownItFitMedia = require("markdown-it-fitmedia");
const markdownItTrimmer = require("markdown-it-trimmer");
const markdownItCooklang = require("markdown-it-cooklang");
const markdownItScrollTable = require("markdown-it-scrolltable");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItMark = require("markdown-it-mark");
const markdownItMathJax = require("markdown-it-mathjax3");
const markdownItEmoji = require("markdown-it-emoji");
const markdownItInclude = require("markdown-it-include");
const markdownItGitHubAlerts = require("markdown-it-rss-friendly-github-alerts");
const striptags = require("striptags");
const fs = require("fs");
const path = require("path");

function mySlugify(s) {
  return slugify(s, { lower: true });
}

const site = require("../_data/site.js");

module.exports = {
  firstImageTag: function (html) {
    if (html) {
      const match = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/);
      if (match) {
        return match[0];
      }
    }
  },

  allImageTags: function (html) {
    if (html) {
      const matches = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/gi);
      if (matches) {
        return matches;
      } else {
        return [];
      }
    }
  },

  getAttr: function (html, attr) {
    if (html) {
      const match = html.match(new RegExp(`${attr}="(.*?)"`, "i"));
      if (match) {
        return match[1];
      }
    }
  },

  srcAttr: function (html) {
    return this.getAttr(html, "src");
  },

  altAttr: function (html) {
    return this.getAttr(html, "alt");
  },

  isLiveItem: function (item) {
    const now = new Date();
    return (
      item.date <= now && item.data.draft !== true && item.data.draft !== "yes"
    );
  },

  isPost: function (item) {
    return item.inputPath.startsWith(`./${site.input}/posts/`);
  },

  tagUrl: function (tag) {
    let standard = {
      tag: "*",
      url: "*",
    };
    let empty = {
      tag: "",
      url: "",
    };
    let siteTags = site.tagnav;
    if (siteTags) {
      for (let v of siteTags) {
        if (typeof v != "string" && !(v instanceof String)) {
          if (v.tag == tag) {
            return v.url;
          }
          if (v.tag == "*") {
            standard = v;
          }
          if (!v.tag) {
            empty = v;
          }
        }
      }
    }

    if (tag == "") {
      return empty.url;
    } else {
      return standard.url.replace(/\*/g, tag);
    }
  },

  removeHtml: function (text) {
    if (text) {
      return striptags(text);
    }
  },

  compareItemDate: function (a, b) {
    return a.date - b.date;
  },

  compareInputFileName: function (a, b) {
    const aFileName = path.basename(a.inputPath);
    const bFileName = path.basename(b.inputPath);
    return aFileName.localeCompare(bFileName);
  },

  isoDate: function (d) {
    if (d) {
      return d.toISOString();
    } else {
      return "";
    }
  },

  humanDate: function (d) {
    if (d) {
      return new Intl.DateTimeFormat(site.locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(d);
    } else {
      return "";
    }
  },

  humanDateTime: function (d) {
    if (d) {
      return new Intl.DateTimeFormat(site.locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        second: "numeric",
      }).format(d);
    } else {
      return "";
    }
  },

  extractTags: function (collection) {
    let tagSet = new Set();
    for (let post of collection) {
      if (post.data.tags) {
        for (let tag of post.data.tags) {
          tagSet.add(tag);
        }
      }

      if (post.data?.tags?.includes(site.starTag)) {
        post.data.starred = site.starTag;
      } else {
        post.data.starred = "";
      }
    }
    return [...tagSet].sort();
  },

  chunk: function (values = [], chunkSize = 1) {
    let chunks = [];
    let tmp = [...values];
    if (chunkSize <= 0) return chunks;
    while (tmp.length) {
      chunks.push(tmp.splice(0, chunkSize));
    }
    return chunks;
  },

  chunkByYear: function (values = [], dateProperty = "date") {
    let years = new Map();
    for (let entry of values) {
      let date = new Date(entry[dateProperty]);
      let year = date.getFullYear();
      let chunk = years.get(year);
      if (!chunk) {
        chunk = [];
        chunk.year = year;
        years.set(year, chunk);
      }
      chunk.push(entry);
    }

    if (values.length / years.size <= 5) {
      //if each year in average contains <= 5 entries
      //do not chunk into years and return a single chunk!
      let chunk = [...values];
      chunk.years = [...years.keys()].sort();
      if (chunk.years.at(0) != chunk.years.at(-1)) {
        chunk.yearsInterval = [chunk.years.at(0), chunk.years.at(-1)];
      } else {
        chunk.year = chunk.years.at(0);
        delete chunk.years;
      }
      return [chunk];
    } else {
      return [...years.values()];
    }
  },

  newestPage: function (path) {
    return path;
  },

  oldestPage: function (path, max) {
    return path + max + "/";
  },

  newerPage: function (path, currentIndex) {
    if (currentIndex > 1) {
      return path + currentIndex + "/";
    } else if (currentIndex == 1) {
      return path;
    } else {
      return "";
    }
  },

  currentPage: function (path, currentIndex) {
    if (currentIndex >= 1) {
      return path + (currentIndex + 1) + "/";
    } else return path;
  },

  olderPage: function (path, currentIndex, max) {
    if (currentIndex < max - 1) {
      return path + (currentIndex + 2) + "/";
    } else {
      return "";
    }
  },

  getMarkdownLib: function () {
    const mdlib = markdownIt({
      html: true,
      breaks: true,
      linkify: false,
      typographer: true,
      quotes: "„“‚‘",
    })
      .use(markdownItContainer)
      .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.headerLink({
          safariReaderFix: true,
          class: "heading-anchor",
        }),
        slugify: mySlugify,
      })
      .use(markdownItTocDoneRight, {
        slugify: mySlugify,
      })
      .use(markdownItMark)
      .use(markdownItDefList)
      .use(markdownItScrollTable)
      .use(markdownItAttrs)
      .use(markdownItFootnote)
      .use(markdownItTrimmer)
      .use(markdownItFitMedia, {
        imgDir: `./${site.input}`,
        decoding: "async",
      })
      .use(markdownItMathJax)
      .use(markdownItEmoji)
      .use(markdownItInclude)
      .use(markdownItGitHubAlerts)
      .use(markdownItCooklang);

    return mdlib;
  },

  hashCode: function (value, seed = 0) {
    //from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    str = String(value);
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  },

  stat: function (path) {
    return fs.statSync(path);
  },

  getTrimBase: function () {
    let base = site.base;
    if (base) {
      return base.replace(/\//g, "");
    } else {
      return "";
    }
  },

  getBase: () => {
    let base = site.base;
    if (base && base != "/") {
      return `/${base.replace(/\//g, "")}/`;
    } else {
      return "/";
    }
  },
};
