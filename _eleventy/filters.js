const lunr = require('lunr');
const path = require('path');
const utils = require('./utils.js');
const site = require('../_data/site.js');

let colorMap;

module.exports = {

    live: function(collection) {
        return collection ? collection.filter(utils.isLiveItem) : collection;
    },

    post: function(collection) {
        return collection ? collection.filter(utils.isPost) : collection;
    },

    searchAble: function(collection) {
        return collection ? collection.filter(utils.isSearchAble) : collection;
    },

    rssAble: function(collection) {
        return collection ? collection.filter(utils.isRssAble) : collection;
    },

    authorEmail: function(page) {
        if (page && page.data.author && page.data.author.email) {
            return page.data.author.email;
        } else if (site.ownership && site.ownership.email) {
            return site.ownership.email;
        }
    },

    authorName: function(page) {
        if (page && page.data.author && page.data.author.name) {
            return page.data.author.name;
        } else if (site.ownership && site.ownership.name) {
            return site.ownership.name;
        }
    },

    contentIndex: function(collection) {
        let result = [];
        for (let item of collection) {
            result.push(utils.mapItem(item));
        }
        return JSON.stringify(result);
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
        const index = lunr(function() {
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
        return JSON.stringify(index);
    },

    excerptIndex: function(collection) {
        let result = [];
        for (let item of collection) {
            let mappedItem = utils.mapItem(item);
            mappedItem.content = utils.excerptFromItem(item);

            result.push(mappedItem);
        }
        return JSON.stringify(result);
    },

    firstImage: function(collection) {
        let result = [];
        for (let item of collection) {
            let img = utils.firstImageTag(item.templateContent);
            if (img) {
                let src = utils.srcAttr(img);
                let alt = utils.altAttr(img);
                let humanDate = utils.humanDate(item.date);
                let dimensions;
                try {
                    dimensions = utils.getDimensions(`${site.output}${src}`);
                } catch (e) {
                    console.log(e);
                }
                result.push({
                    src: src,
                    width: dimensions ? dimensions.width : 0,
                    height: dimensions ? dimensions.height : 0,
                    alt: alt,
                    url: item.url,
                    title: item.data.title,
                    starred: item.data.starred,
                    date: item.date,
                    humanDate: humanDate
                });
            }
        }
        return JSON.stringify(result);
    },

    imgAspectRatio: function(src) {
        try {
            dimensions = utils.getDimensions(`${site.output}${src}`);
            if (dimensions.height > 0 && dimensions.width > 0) {
                return `aspect-ratio:${dimensions.width}/${dimensions.height};`;
            }
        } catch (e) {
            console.log(e);
        }
    },

    responsiveHero: function(src) {
        let clearSrc = utils.clearResponsive(src);

        const imgAspectRatio = function() {
            try {
                dimensions = utils.getDimensions(`${site.output}${clearSrc}`);
                if (dimensions.height > 0 && dimensions.width > 0) {
                    return `aspect-ratio:${dimensions.width}/${dimensions.height};`;
                }
            } catch (e) {
                console.log(e);
            }
        }

        let img = `<img src="${clearSrc}" alt="" class="w-100 fit-cover fit-center" style="max-height: unset; ${imgAspectRatio()}" loading="eager">`;
        if (utils.isResponsive(src)) {
            let extname = path.extname(clearSrc);
            let basename = path.basename(clearSrc, extname);
            let dirname = path.dirname(clearSrc);
            return `<picture>
            <source srcset="${dirname}/${basename}.webp" type="image/webp">
            ${img}
            </picture>`;
        } else {
            return img;
        }
    },

    imgSizeHint: function(src) {
        try {
            dimensions = utils.getDimensions(`${site.output}${src}`);
            if (dimensions.height > 0 && dimensions.width > 0) {
                return `width="${dimensions.width}" height="${dimensions.height}"`;
            }
        } catch (e) {
            console.log(e);
        }
    },

    humanDate: function(d) {
        return utils.humanDate(d);
    },

    humanDateTime: function(d) {
        return utils.humanDateTime(d);
    },

    isoDate: function(d) {
        return utils.isoDate(d);
    },

    tagUrl: function(tag) {
        return utils.tagUrl(tag);
    },

    createColorMap: function(values) {

        colorMap = new Map();
        if (site.tagColors && site.tagColors.length) {
            for (let value of values) {
                colorIndex = Math.abs(utils.hashCode(value)) % site.tagColors.length;
                colorMap.set(value, site.tagColors[colorIndex]);
            }
        }
        return colorMap;
    },

    tagColor: function(tag) {
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