const lunr = require("lunr");
const utils = require("./utils.js");

function findNextItem(collection, current) {
    let passedCurrent;
    if (collection && collection.length > 1 && current) {
        for (let item of collection) {
            if (passedCurrent) {
                if (item.data.nostepnav || item.data.notags) {
                    continue;
                } else {
                    return item;
                }
            }

            if (item.url == current.url) {
                passedCurrent = item;
            }
        }
    }
    return null;
}

module.exports = {

    live: function(collection) {
        return collection ? collection.filter(utils.isLiveItem) : collection;
    },

    searchAble: function(collection) {
        return collection ? collection.filter(utils.isSearchAble) : collection;
    },

    rssAble: function(collection) {
        return collection ? collection.filter(utils.isRssAble) : collection;
    },

    contentIndex: function(collection) {
        let result = [];
        for (let item of collection) {
            result.push(utils.mapItem(item));
        }
        return result;
    },

    tagIntro: function(collection, tagintro) {
        for (let item of collection) {
            if (item.data.tagintro == tagintro) {
                return item.templateContent;
            }
        }
        return '';
    },

    searchIndex: function(collection) {
        return lunr(function() {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('subtitle', { boost: 10 });
            this.field('abstract', { boost: 10 });
            this.field('author');
            this.field('refer');
            this.field('tags');
            this.field('content');

            for (let item of collection) {
                if (utils.isSearchAble(item)) {
                    this.add(utils.mapItem(item));
                }
            }
        });
    },

    excerptIndex: function(collection) {
        let result = [];
        for (let item of collection) {
            let mappedItem = utils.mapItem(item);
            mappedItem.content = utils.excerptFromItem(item);

            result.push(mappedItem);
        }
        return result
    },

    firstImage: function(collection) {
        let result = [];
        for (let item of collection) {
            let img = utils.firstImageTag(item.templateContent);
            if (img) {
                let src = utils.srcAttr(img);
                let alt = utils.altAttr(img);
                let humanDate = utils.humanDate(item.date);
                result.push({
                    src: src,
                    alt: alt,
                    url: item.url,
                    title: item.data.title,
                    humanDate: humanDate,
                });
            }
        }
        return result
    },

    humanDate: function(d) {
        return utils.humanDate(d);
    },

    humanDateTime: function(d) {
        return utils.humanDateTime(d);
    },

    isoDate: function(d) {
        return utils.isoDate(d);
    }

}