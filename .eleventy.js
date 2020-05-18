const rss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const lunr = require("lunr");
const stripHtml = require("string-strip-html");
const site = require('./_data/site.json');

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
    eleventyConfig.addLayoutAlias('rssfeed', 'layouts/rssfeed.njk');
    eleventyConfig.addLayoutAlias('search', 'layouts/search.html');
}

function liveContent(content) {
    const now = new Date();
    return content.date <= now
        && content.data.published !== false
        && content.data.published !== 'no';
}

function addCollections(eleventyConfig) {
    eleventyConfig.addCollection('content', collection => {
        return [
            ...collection.getFilteredByGlob('content/**').filter(liveContent)
        ];
    });
    eleventyConfig.addCollection('pages', collection => {
        return [
            ...collection.getFilteredByGlob('content/pages/**').filter(liveContent)
        ];
    });
    eleventyConfig.addCollection('posts', collection => {
        return [
            ...collection.getFilteredByGlob('content/posts/**').filter(liveContent)
        ].reverse();
    });
}

function addFilters(eleventyConfig) {
    eleventyConfig.addFilter("searchindex", searchFilter);
    eleventyConfig.addFilter("map", mapFilter);
    eleventyConfig.addFilter("excerpt", excerptFilter);
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