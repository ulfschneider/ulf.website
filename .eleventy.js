const rss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItDefList = require('markdown-it-deflist');
const markdownItFitMedia = require('markdown-it-fitmedia');

const site = require('./_data/site.js');
const utils = require('./_eleventy/utils.js');
const filters = require('./_eleventy/filters.js');

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

    eleventyConfig.addPassthroughCopy({ '_admin': 'admin' }); //netlify CMS
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

    return {
        dir: {
            includes: '_includes',
            layouts: '_layouts',
            data: '_data'
        }
    }
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
    }).use(markdownItDefList)
        .use(markdownItFitMedia, {
            imgDir: './content'
        });

    eleventyConfig.setLibrary('md', mdlib)
}

function addLayoutAliases(eleventyConfig) {
    eleventyConfig.addLayoutAlias('default', 'default.html');
    eleventyConfig.addLayoutAlias('list', 'list.html');
    eleventyConfig.addLayoutAlias('image', 'image.html');
    eleventyConfig.addLayoutAlias('gallery', 'gallery.html');
    eleventyConfig.addLayoutAlias('blank', 'blank.html');
    eleventyConfig.addLayoutAlias('none', 'none.html');
    eleventyConfig.addLayoutAlias('rss', 'rss.njk');
    eleventyConfig.addLayoutAlias('search', 'search.html');
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
