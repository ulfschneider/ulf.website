
const lunr = require("lunr");
const utils = require("./utils.js");

module.exports = {

    live: function (collection) {
        return collection ? collection.filter(utils.isLiveItem) : collection;
    },

    mustContainTag: function (collection, filterTags) {
        let result = new Set();

        if (collection && filterTags) {

            if (typeof filterTags === 'string' || filterTags instanceof String) {
                filterTags = [filterTags]; //make it an array
            }

            for (let item of collection) {
                for (let tag of item.data.tags) {
                    if (filterTags.includes(tag)) {
                        result.add(item);
                        break;
                    }
                }
            }
        }
        return Array.from(result.values()).sort(utils.comparePostDate);
    },

    getPrev: function (collection, current) {
        let passed;
        if (collection && collection.length > 1 && current) {
            for (let item of collection) {
                if (item.url == current.url) {
                    return passed;
                }
                passed = item;
            }
        }
    },

    getNext: function (collection, current) {
        let passedCurrent;
        if (collection && collection.length > 1 && current) {
            for (let item of collection) {
                if (passedCurrent) {
                    return item;
                }

                if (item.url == current.url) {
                    passedCurrent = item;
                }
            }
        }
    },

    contentIndex: function (collection) {
        let result = [];
        for (let item of collection) {
            result.push(utils.mapItem(item));
        }
        return result;
    },

    searchIndex: function (collection) {
        return lunr(function () {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('subtitle', { boost: 10 });
            this.field('abstract', { boost: 10 });
            this.field('author');
            this.field('refer');
            this.field('categories');
            this.field('tags');
            this.field('content');
            for (let item of collection) {
                this.add(utils.mapItem(item));
            }
        });
    },

    excerptIndex: function (collection) {
        let result = [];
        for (let item of collection) {
            let mappedItem = utils.mapItem(item);
            mappedItem.content = utils.excerptFromItem(item);

            result.push(mappedItem);
        }
        return result
    },

    firstImage: function (collection) {
        let result = [];
        for (let item of collection) {
            let img = utils.firstImageTag(item);
            if (img) {
                let src = utils.imageSrc(img);
                let alt = utils.imageAlt(img);
                result.push({
                    src: src,
                    alt: alt,
                    url: item.url
                });
            }
        }
        return result
    }

}