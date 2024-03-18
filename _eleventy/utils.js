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
const markdownItGitHubAlerts = require("markdown-it-github-alerts");
const sizeOf = require("image-size");
const striptags = require("striptags");
const fs = require("fs");
const path = require("path");

const dayjs = require("dayjs");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(timezone);

function mySlugify(s) {
  return slugify(s, { lower: true });
}

const site = require("../_data/site.js");

module.exports = {
  excerptFromText: function (text) {
    let excerpt = this.removeHtml(text);
    if (excerpt) {
      let excerptWordCount = site.excerptWordCount ? site.excerptWordCount : 25;
      let words = excerpt.split(" ");
      excerpt = words.slice(0, excerptWordCount).join(" ");
      if (words.length > excerptWordCount) {
        excerpt += " …";
      }
    }
    return excerpt;
  },

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
      const match = html.match(new RegExp(`${attr}="(.*?)"`));
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

  isSearchAble: function (item) {
    if (item.templateContent && item.templateContent.trim()) {
      return (
        item.data.nosearch == null &&
        this.isLiveItem(item) &&
        !item.inputPath.startsWith(`./${site.input}/tagintros/`)
      );
    }
    return false;
  },

  removeHtml: function (text) {
    if (text) {
      return striptags(text);
    }
  },

  mapItem: function (item) {
    let tagsWithUrls = [];

    if (item.data.tags) {
      let tags = [...new Set(item.data.tags)].sort();
      for (let tag of tags) {
        tagsWithUrls.push({
          name: tag,
          url: this.tagUrl(tag),
        });
      }
    }

    return {
      id: item.url,
      title: item.data.title,
      date: item.date,
      humanDate: this.humanDate(item.date),
      abstract: item.data.abstract,
      author: item.data.author,
      refer: item.data.refer,
      layout: item.data.layout,
      tags: tagsWithUrls,
      notags: item.data.notags,
      starred: item.data.starred,
      content: this.removeHtml(item.templateContent),
      excerpt: this.excerptFromText(item.templateContent),
      commentContents: item.data.comments
        ? item.data.comments.map((comment) => comment.body).join(" ")
        : undefined,
      commentAuthors: item.data.comments
        ? item.data.comments.map((comment) => comment.author).join(" ")
        : undefined,
    };
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
    return dayjs(d).toISOString();
  },

  humanDate: function (d) {
    if (d) {
      const locale = site.locale ? site.locale : "en";
      let dt = dayjs(d).locale(locale);
      return dt.format("DD MMM YYYY");
    } else {
      return "";
    }
  },

  humanDateTime: function (d) {
    if (d) {
      const locale = site.locale ? site.locale : "en";
      let dt = dayjs(d).locale(locale);
      return dt.format("DD MMM YYYY at HH:mm:ss");
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
      .use(markdownItGitHubAlerts, {
        icons: {
          note: '<svg class="octicon octicon-info" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
          tip: '<svg class="octicon octicon-light-bulb" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>',
          important:
            '<svg class="octicon octicon-report" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
          warning:
            '<svg class="octicon octicon-alert" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
          caution:
            '<svg class="octicon octicon-stop" fill="currentColor" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
        },
      })
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
