const rss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');


const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTableOfContents = require('markdown-it-toc-done-right');
const markdownItDefList = require('markdown-it-deflist');
const markdownItFitMedia = require('markdown-it-fitmedia');
const markdownItAttrs = require('markdown-it-attrs');

const site = require('./_data/site.js');
const utils = require('./_eleventy/utils.js');
const filters = require('./_eleventy/filters.js');
const transforms = require('./_eleventy/transforms.js');

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

    eleventyConfig.addTransform('htmlmin', transforms.minifyHtml);
    eleventyConfig.addPassthroughCopy({ '_root': '/' });
    eleventyConfig.addPassthroughCopy({ 'content/assets': '/assets' });

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
    })
        .use(markdownItAnchor, {
            permalink: true,
            permalinkClass: 'anchor',
            permalinkSymbol: '#'
        })
        .use(markdownItTableOfContents)
        .use(markdownItDefList)
        .use(markdownItFitMedia, {
            imgDir: './content'
        })
        .use(markdownItAttrs);

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

    eleventyConfig.addCollection('usedSiteTags', collection => {
        let usedTags = utils.extractTags(collection);
        if (site.tagnav && site.tagnav.length) {
            return site.tagnav.filter(tag => usedTags.includes(tag));
        } else {
            return usedTags;
        }
    });
    eleventyConfig.addCollection('liveSiteTagContent', collection => {
        return [
            ...collection.getFilteredByGlob('content/**')
                .filter(utils.isLiveItem)
                .filter(utils.hasSiteTag)
                .sort(utils.compareItemDate)
        ];
    });

    eleventyConfig.addCollection('liveContent', collection => {
        return [
            ...collection.getFilteredByGlob('content/**')
                .filter(utils.isLiveItem)
                .sort(utils.compareItemDate)
        ];
    });
}

function addFilters(eleventyConfig) {
    eleventyConfig.addFilter('searchIndex', filters.searchIndex);
    eleventyConfig.addFilter('contentIndex', filters.contentIndex);
    eleventyConfig.addFilter('excerptIndex', filters.excerptIndex);
    eleventyConfig.addFilter('firstImage', filters.firstImage);
    eleventyConfig.addFilter('live', filters.live);
    eleventyConfig.addFilter('tagIntro', filters.tagIntro);
    eleventyConfig.addFilter('humanDate', filters.humanDate);
    eleventyConfig.addFilter('mustNotContainLayout', filters.mustNotContainLayout);
    eleventyConfig.addFilter('mustEqualTags', filters.mustEqualTags);
    eleventyConfig.addFilter('getPrev', filters.getPrev);
    eleventyConfig.addFilter('getNext', filters.getNext);
}

