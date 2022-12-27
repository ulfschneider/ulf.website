const MiniSearch = require('minisearch');
const path = require('path');
const ccd = require('cached-commit-date');
const utils = require('./utils.js');
const site = require('../_data/site.js');

let colorMap;

module.exports = {

    live: function (collection) {
        return collection ? collection.filter(utils.isLiveItem) : collection;
    },

    post: function (collection) {
        return collection ? collection.filter(utils.isPost) : collection;
    },

    searchAble: function (collection) {
        return collection ? collection.filter(utils.isSearchAble) : collection;
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
    //return a date if the latest commit date is available and differs from the page.date by at least one day
    //otherwise return empty string
    indicateModifiedDate: function (page) {
        let date = page.date;
        let humanDate = utils.humanDate(date);
        let commitDate = ccd.commitDate(page.inputPath);
        let humanCommitDate = utils.humanDate(commitDate);

        if (humanCommitDate && humanDate != humanCommitDate) {
            return commitDate;
        } else {
            return '';
        }
    },

    modifiedDate: function (page) {
        let commitDate = ccd.commitDate(page.inputPath);
        console.log(page.inputPath);
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

        return '';
    },

    searchIndex: function (collection) {
        const INDEX_FIELDS = [
            'id',
            'title',
            'humanDate',
            'author',
            'refer',
            'tags',
            'abstract',
            'content'];

        const STORE_FIELDS = [
            'id',
            'title',
            'date',
            'humanDate',
            'author',
            'refer',
            'tags',
            'notags',
            'starred',
            'abstract',
            'excerpt'];

        let miniSearch = new MiniSearch({ fields: INDEX_FIELDS, storeFields: STORE_FIELDS });
        for (let item of collection) {
            let mappedItem = utils.mapItem(item);
            if (mappedItem.id && !miniSearch.has(mappedItem.id)) {
                miniSearch.add(mappedItem);
            }
        }

        let searchIndex = miniSearch.toJSON();
        //store the configured fields within the search index
        //to access it later when importing the index
        searchIndex.INDEX_FIELDS = INDEX_FIELDS;
        return JSON.stringify(searchIndex);
    },

    firstImage: function (collection, url) {
        let result = [];
        for (let item of collection) {
            if (!url || (url && url == item.url)) {
                let src;
                let alt;
                if (item.data.hero) {
                    src = utils.clearResponsive(item.data.hero);
                    if (item.data.heroalt) {
                        alt = utils.removeHtml(item.data.heroalt);
                    } else if (item.data.herocaption) {
                        alt = utils.removeHtml(item.data.herocaption);
                    }
                } else {
                    let img = utils.firstImageTag(item.templateContent);
                    if (img) {
                        src = utils.clearResponsive(utils.srcAttr(img));
                        alt = utils.altAttr(img);
                    }
                }
                if (src) {
                    let extname = path.extname(src);
                    let stem = path.basename(src, extname);
                    let dirname = path.dirname(src);
                    let humanDate = utils.humanDate(item.date);
                    let dimensions;
                    try {
                        dimensions = utils.getDimensions(`${site.output}${src}`);
                    } catch (e) {
                        console.log(e);
                    }

                    let imgData = {
                        src: src,
                        smallSrc: dirname + '/' + stem + site.imgSmallPostfix + extname,
                        width: dimensions ? dimensions.width : 0,
                        height: dimensions ? dimensions.height : 0,
                        alt: alt,
                        url: item.url,
                        title: item.data.title,
                        starred: item.data.starred,
                        date: item.date,
                        humanDate: humanDate
                    };

                    if (url) {
                        return imgData;
                    } else {
                        result.push(imgData);
                    }
                }
            }
        }
        if (url) {
            return {};
        } else {
            return JSON.stringify(result);
        }
    },

    imgAspectRatio: function (src) {
        return utils.imgAspectRatio(src);
    },

    imgSizeHint: function (src) {
        return utils.imgSizeHint(src);
    },

    responsiveHero: function (src, alt) {
        let clearSrc = utils.clearResponsive(src);

        let img = `<img src="${clearSrc}" ${alt ? 'alt="' + alt + '"' : 'alt=""'} class="w-full h-auto object-cover" style="${utils.imgAspectRatio(clearSrc)}" ${utils.imgSizeHint(clearSrc)} loading="eager">`;
        if (utils.isResponsive(src)) {
            let extname = path.extname(clearSrc);
            let stem = path.basename(clearSrc, extname);
            let dirname = path.dirname(clearSrc);
            return `<picture>
            <source srcset="${dirname}/${stem}.webp" type="image/webp">
            ${img}
            </picture>`;
        } else {
            return img;
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

    createColorMap: function (values) {

        colorMap = new Map();
        if (site.tagColors && site.tagColors.length) {
            for (let value of values) {
                colorIndex = Math.abs(utils.hashCode(value)) % site.tagColors.length;
                colorMap.set(value, site.tagColors[colorIndex]);
            }
        }
        return colorMap;
    },

    tagColor: function (tag) {
        if (!colorMap) {
            console.error('ColorMap has not been initialized. Please call createColorMap once before calling tagColor.');
            return '';
        }
        if (colorMap.size) {
            let color = colorMap.get(tag);
            return color ? color : '';

        } else {
            return '';
        }
    }

}