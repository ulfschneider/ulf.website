const rss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');

const site = require('./_data/site.js');
const utils = require('./_eleventy/utils.js');
const filters = require('./_eleventy/filters.js');
const transforms = require('./_eleventy/transforms.js');

module.exports = function(eleventyConfig) {

    addLayoutAliases(eleventyConfig);
    addCollections(eleventyConfig);
    addFilters(eleventyConfig);
    addMarkdownLib(eleventyConfig);
    addBrowserSync404(eleventyConfig);

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
    eleventyConfig.addPlugin(syntaxHighlight, { alwaysWrapLineHighlights: true });

    return {
        dir: {
            includes: '_includes',
            layouts: '_layouts',
            data: '_data',
            output: process.env.OUTPUT ? process.env.OUTPUT : '_site'
        }
    }
}

function addMarkdownLib(eleventyConfig) {
    eleventyConfig.setLibrary('md', utils.getMarkdownLib());
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
    eleventyConfig.addFilter('humanDateTime', filters.humanDateTime);
    eleventyConfig.addFilter('isoDate', filters.isoDate);
}

function addBrowserSync404(eleventyConfig) {
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function(err, bs) {

                bs.addMiddleware("*", (req, res) => {
                    const content_404 = fs.readFileSync('_site/404.html');
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    // Add 404 http status code in request header.
                    // res.writeHead(404, { "Content-Type": "text/html" });
                    res.writeHead(404);
                    res.end();
                });
            }
        }
    });
}