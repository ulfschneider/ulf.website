const rss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const lunr = require("lunr");
const stripHtml = require("string-strip-html");
const site = require('./_data/site.json');

module.exports = function (eleventyConfig) {

    const now = new Date(); 
    const live = post => post.date <= now && post.data.published !== false && post.data.published !== 'no';

    eleventyConfig.addCollection('content', collection => {
        return [
            ...collection.getFilteredByGlob('content/**').filter(live)
        ];
    });
    eleventyConfig.addCollection('pages', collection => {
        return [
            ...collection.getFilteredByGlob('content/pages/**').filter(live)
        ];
    });
    eleventyConfig.addCollection('posts', collection => {
        return [
            ...collection.getFilteredByGlob('content/posts/**').filter(live)
        ].reverse();
    });
    eleventyConfig.addFilter("searchindex", searchFilter);
    eleventyConfig.addFilter("map", mapFilter);
    eleventyConfig.addFilter("excerpt", excerptFilter);

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