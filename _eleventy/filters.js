const ccd = require("cached-commit-date");
const utils = require("./utils.js");
const site = require("../_data/site.js");
const comments = require("../_data/comments.js");

let colorMap;

function createColorMap(values) {
  if (!colorMap) {
    colorMap = new Map();
    if (site.tagColors && site.tagColors.length) {
      for (let value of values) {
        colorIndex = Math.abs(utils.hashCode(value)) % site.tagColors.length;
        colorMap.set(value, site.tagColors[colorIndex]);
      }
    }
  }
  return colorMap;
}

module.exports = {
  escapeHtmlQuotes: function (content) {
    return content.replaceAll(/"/gi, "&quot;");
  },
  live: function (collection) {
    return collection ? collection.filter(utils.isLiveItem) : collection;
  },

  post: function (collection) {
    return collection ? collection.filter(utils.isPost) : collection;
  },

  isPost: function (page) {
    return utils.isPost(page);
  },

  rssAble: function (collection) {
    return collection ? collection.filter(utils.isRssAble) : collection;
  },

  authorEmail: function (page) {
    if (page && page.data.author && page.data.author.email) {
      return page.data.author.email;
    } else if (site.ownership && site.ownership.email) {
      return site.ownership.email;
    }
  },

  authorName: function (page) {
    if (page && page.data.author && page.data.author.name) {
      return page.data.author.name;
    } else if (site.ownership && site.ownership.name) {
      return site.ownership.name;
    }
  },

  //this is very slow due to commitDate
  //returns a date if the latest commit date is available and differs from the page.date by at least one day
  //otherwise returns empty string
  indicateModifiedDate: function (page) {
    let date = page.date;
    let humanDate = utils.humanDate(date);
    let commitDate = ccd.commitDate(page.inputPath);
    let humanCommitDate = utils.humanDate(commitDate);

    if (humanCommitDate && humanDate != humanCommitDate) {
      return commitDate;
    } else {
      return "";
    }
  },

  modifiedDate: function (page) {
    let commitDate = ccd.commitDate(page.inputPath);
    if (commitDate) {
      return commitDate;
    } else {
      return page.date;
    }
  },

  tagIntro: function (collection, tag) {
    for (let item of collection) {
      if (!tag && (!item.data.tags || item.data.tags.length == 0)) {
        return item.templateContent;
      }
      if (item.data?.tags?.includes(tag)) {
        return item.templateContent;
      }
    }

    return "";
  },

  siteTags: function (collection) {
    let tags = utils.extractTags(
      collection.map((item) => {
        if (item.data?.tags?.includes(site.starTag)) {
          item.data.starred = site.starTag;
        } else {
          item.data.starred = "";
        }
        return item;
      })
    );

    createColorMap(tags);

    return tags;
  },

  itemFromUrl: function (collection, url) {
    for (const p of collection) {
      if (p.url == url) {
        return p;
      }
    }
  },

  firstImage: function (content) {
    function getFirstImageFromItem(content, data) {
      let src;
      let alt;
      if (data?.hero) {
        src = data.hero;
        if (data.heroalt) {
          alt = utils.removeHtml(data.heroalt);
        } else if (data.herocaption) {
          alt = utils.removeHtml(data.herocaption);
        }
      } else {
        let img = utils.firstImageTag(content);
        if (img) {
          src = utils.srcAttr(img);
          alt = utils.altAttr(img);
        }
      }
      if (src) {
        let imgData = {
          src: src,
          alt: alt,
          url: data.url,
          title: data.title,
          starred: data.starred,
          date: data.date,
          humanDate: utils.humanDate(data.date),
        };

        return imgData;
      }
    }

    if (!(typeof content == "string") && content?.[Symbol.iterator]) {
      //we are working on a collection
      const result = [];
      for (let item of content) {
        const image = getFirstImageFromItem(
          item.templateContent,
          Object.assign({}, item.data, { url: item.url })
        );
        if (image) {
          result.push(image);
        }
      }
      return result;
    } else if (typeof content == "string") {
      //we are working on a single page
      //when registering this function as a filter,
      //the page is available via this.page
      const image = getFirstImageFromItem(content, this.page);
      return image || {};
    }
  },

  humanDate: function (d) {
    return utils.humanDate(d);
  },

  humanDateTime: function (d) {
    return utils.humanDateTime(d);
  },

  isoDate: function (d) {
    return utils.isoDate(d);
  },

  tagUrl: function (tag) {
    return utils.tagUrl(tag);
  },

  hasTag: function (tags, tag) {
    return tags && tag && tags.includes(tag);
  },

  tagColor: function (tag) {
    if (!colorMap) {
      console.error(
        "ColorMap has not been initialized. Please call createColorMap once before calling tagColor."
      );
      return "";
    }
    if (colorMap.size) {
      let color = colorMap.get(tag);
      return color ? color : "";
    } else {
      return "";
    }
  },

  commentRootIssueNumber: async function (item) {
    return comments.getRootIssueNumber(item.url);
  },

  comments: async function (item) {
    return comments.get(item.url);
  },

  withComments: async function (items) {
    for (let item of items) {
      item.data.comments = await comments.get(item.url);
    }
    return items;
  },
};
