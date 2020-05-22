const rss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const lunr = require("lunr");
const stripHtml = require("string-strip-html");
const site = require('./_data/site.js');

module.exports = function (eleventyConfig) {

    addLayoutAliases(eleventyConfig);
    addCollections(eleventyConfig);
    addFilters(eleventyConfig);
    eleventyConfig.setDataDeepMerge(true);
    eleventyConfig.setTemplateFormats([
        'md',
        'html',
        'njk'
    ]);

    eleventyConfig.addPassthroughCopy('css');
    eleventyConfig.addPassthroughCopy('fonts');
    eleventyConfig.addPassthroughCopy('js');

    eleventyConfig.addPassthroughCopy('*.png');
    eleventyConfig.addPassthroughCopy('*.ico');
    eleventyConfig.addPassthroughCopy('*.svg');

    eleventyConfig.addPassthroughCopy("serviceworker.js");
    eleventyConfig.addPassthroughCopy("manifest.json");

    eleventyConfig.addPlugin(rss);
    eleventyConfig.addPlugin(syntaxHighlight);

}

function addLayoutAliases(eleventyConfig) {
    eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
    eleventyConfig.addLayoutAlias('list', 'layouts/list.html');
    eleventyConfig.addLayoutAlias('image', 'layouts/image.html');
    eleventyConfig.addLayoutAlias('gallery', 'layouts/gallery.html');
    eleventyConfig.addLayoutAlias('blank', 'layouts/blank.html');
    eleventyConfig.addLayoutAlias('none', 'layouts/none.html');
    eleventyConfig.addLayoutAlias('rss', 'layouts/rss.njk');
    eleventyConfig.addLayoutAlias('search', 'layouts/search.html');
}

function liveContent(content) {
    const now = new Date();
    return content.date <= now
        && content.data.published !== false
        && content.data.published !== 'no'
        && content.data.draft !== true
        && content.data.draft !== 'yes';
}

function comparePostDate(a, b) {
    return a.date - b.date;
}

function addCollections(eleventyConfig) {
    eleventyConfig.addCollection('allTags', collection => {
        let tagSet = new Set();
        for (let post of collection.getAll().filter(liveContent)) {
            if (post.data.tags) {
                for (let tag of post.data.tags) {
                    tagSet.add(tag);
                }
            }
        }
        return Array.from(tagSet.values()).sort();
    });


    eleventyConfig.addCollection('liveContent', collection => {
        return [
            ...collection.getFilteredByGlob('content/**').filter(liveContent)
        ];
    });
    eleventyConfig.addCollection('livePages', collection => {
        return [
            ...collection.getFilteredByGlob('content/pages/**').filter(liveContent)
        ];
    });
    eleventyConfig.addCollection('livePosts', collection => {
        return [
            ...collection.getFilteredByGlob('content/posts/**').filter(liveContent)
        ].reverse();
    });


}

function addFilters(eleventyConfig) {
    eleventyConfig.addFilter("searchindex", searchFilter);
    eleventyConfig.addFilter("map", mapFilter);
    eleventyConfig.addFilter("excerpt", excerptFilter);
    eleventyConfig.addFilter("live", liveFilter);
    eleventyConfig.addFilter("mustContainTag", mustContainTag);
    eleventyConfig.addFilter("getPrev", getPrev);
    eleventyConfig.addFilter("getNext", getNext);
}

function searchFilter(collection) {
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
        for (let item of mapFilter(collection)) {
            this.add(item);
        }
    });
};

function liveFilter(collection) {
    return collection ? collection.filter(liveContent) : collection;
}

function mustContainTag(collection, filterTags) {
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
    return Array.from(result.values()).sort(comparePostDate);
}

function getPrev(collection, current) {
    let passed;
    if (collection && collection.length > 1 && current) {
        for (let item of collection) {            
            if (item.url == current.url) {
                return passed;
            }
            passed = item;
        }
    }
}

function getNext(collection, current) {
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
}

function mapFilter(collection) {
    let result = [];
    for (let item of collection) {
        result.push({
            id: item.url,
            title: item.data.title,
            date: item.date,
            subtitle: item.data.subtitle,
            abstract: item.data.abstract,
            author: item.data.author,
            refer: item.data.refer,
            content: stripHtml(item.templateContent)
        });
    }
    return result;
}

function excerptFilter(collection) {
    let result = [];
    for (let item of collection) {
        let excerpt = stripHtml(item.templateContent);
        if (excerpt) {
            excerpt = excerpt.split(' ')
                .slice(0, 25)
                .join(' ');
        }

        result.push({
            id: item.url,
            title: item.data.title,
            date: item.date,
            subtitle: item.data.subtitle,
            abstract: item.data.abstract,
            author: item.data.author,
            refer: item.data.refer,
            content: excerpt
        });
    }
    return result
}