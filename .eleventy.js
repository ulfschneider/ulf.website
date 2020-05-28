const rss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

const site = require('./_data/site.js');
const utils = require('./_eleventy/utils.js');
const filters = require('./_eleventy/filters.js');
const fitMedia = require('./_eleventy/fit-media.js');

module.exports = function (eleventyConfig) {

    addLayoutAliases(eleventyConfig);
    addCollections(eleventyConfig);
    addFilters(eleventyConfig);
    addMarkdownLib(eleventyConfig);

    eleventyConfig.setDataDeepMerge(true);
    eleventyConfig.setTemplateFormats([
        'md',
        'html',
        'njk'
    ]);

    eleventyConfig.addPassthroughCopy({ '_assets/css': 'css' });
    eleventyConfig.addPassthroughCopy({ '_assets/fonts': 'fonts' });
    eleventyConfig.addPassthroughCopy({ '_assets/js': 'js' });
    eleventyConfig.addPassthroughCopy({ 'content/img': 'img' });

    eleventyConfig.addPassthroughCopy('*.png');
    eleventyConfig.addPassthroughCopy('*.ico');
    eleventyConfig.addPassthroughCopy('*.svg');

    eleventyConfig.addPassthroughCopy('serviceworker.js');
    eleventyConfig.addPassthroughCopy('manifest.json');

    eleventyConfig.addPlugin(rss);
    eleventyConfig.addPlugin(syntaxHighlight);
}

function addMarkdownLib(eleventyConfig) {
    const mdlib = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true
    }).use(markdownItAnchor, {
        permalink: true,
        permalinkClass: 'anchor',
        permalinkSymbol: '#'
    });

    fitMedia.fit(mdlib);
    eleventyConfig.setLibrary('md', mdlib)
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

function addCollections(eleventyConfig) {
    eleventyConfig.addCollection('allTags', collection => {
        let tagSet = new Set();
        for (let post of collection.getAll().filter(utils.isLiveItem)) {
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
            ...collection.getFilteredByGlob('content/**')
                .filter(utils.isLiveItem)
                .sort(utils.compareInputFileName)
        ];
    });
    eleventyConfig.addCollection('livePages', collection => {
        return [
            ...collection.getFilteredByGlob('content/pages/**')
                .filter(utils.isLiveItem)
                .sort(utils.compareInputFileName)
        ];
    });
    eleventyConfig.addCollection('livePosts', collection => {
        return [
            ...collection.getFilteredByGlob('content/posts/**')
                .filter(utils.isLiveItem)
                .sort(utils.compareInputFileName)
        ];
    });
}

function addFilters(eleventyConfig) {
    eleventyConfig.addFilter("searchIndex", filters.searchIndex);
    eleventyConfig.addFilter("contentIndex", filters.contentIndex);
    eleventyConfig.addFilter("excerptIndex", filters.excerptIndex);
    eleventyConfig.addFilter("firstImage", filters.firstImage);
    eleventyConfig.addFilter("live", filters.live);
    eleventyConfig.addFilter("mustContainTag", filters.mustContainTag);
    eleventyConfig.addFilter("mustNotContainLayout", filters.mustNotContainLayout);
    eleventyConfig.addFilter("getPrev", filters.getPrev);
    eleventyConfig.addFilter("getNext", filters.getNext);
}
