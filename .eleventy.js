const rss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginEmbedTweet = require('eleventy-plugin-embed-tweet');

const fs = require('fs');

const site = require('./_data/site.js');
const utils = require('./_eleventy/utils.js');
const filters = require('./_eleventy/filters.js');
const transforms = require('./_eleventy/transforms.js');

module.exports = function (eleventyConfig) {
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
    eleventyConfig.addPassthroughCopy({ 'content/assets': '/assets' });

    eleventyConfig.addPlugin(rss);
    eleventyConfig.addPlugin(syntaxHighlight, {
        preAttributes: {
            // Added in 4.1.0 you can use callback functions too
            "data-language": function ({ language, content, options }) {
                return language;
            }
        },
        codeAttributes: {},
    });
    eleventyConfig.addPlugin(pluginEmbedTweet, {
        cacheDirectory: '_tweets',
        useInlineStyles: false,
        autoEmbed: true
    });

    return {
        dir: {
            includes: '_includes',
            layouts: '_layouts',
            data: '_data',
            output: site.output
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
    eleventyConfig.addLayoutAlias('feed', 'feed.njk');
    eleventyConfig.addLayoutAlias('search', 'search.html');
}

function addCollections(eleventyConfig) {
    eleventyConfig.addCollection('usedSiteTags', collectionAPI => {
        console.log('Derive used site tags');
        let usedSiteTags = utils.extractTags([
            ...collectionAPI.getFilteredByGlob('content/posts/**')
                .map(item => {
                    if (item.data.tags && item.data.tags.includes(site.starTag)) {
                        item.data.starred = site.starTag;
                    } else {
                        item.data.starred = '';
                    }
                    return item;
                })
                .filter(utils.isLiveItem)
        ]);
        filters.createColorMap(usedSiteTags);
        return usedSiteTags;
    });
    eleventyConfig.addCollection('livePosts', collectionAPI => {
        console.log('Derive live posts');
        return [
            ...collectionAPI.getFilteredByGlob('content/**')
                .filter(utils.isLiveItem)
                .filter(utils.isPost)
                .map(item => {
                    item.data.indicateModifiedDate = filters.indicateModifiedDate(item);
                    item.data.modifiedDate = filters.modifiedDate(item);

                    if (item.data.tags && item.data.tags.includes(site.starTag)) {
                        item.data.starred = site.starTag;
                    } else {
                        item.data.starred = '';
                    }
                    return item;
                })
                .sort(utils.compareItemDate)
        ];
    });
    eleventyConfig.addCollection('liveContent', collectionAPI => {
        console.log('Derive live content');
        return [
            ...collectionAPI.getFilteredByGlob('content/**')
                .filter(utils.isLiveItem)
                .map(item => {
                    item.data.indicateModifiedDate = filters.indicateModifiedDate(item);
                    item.data.modifiedDate = filters.modifiedDate(item);
                    return item;
                })
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
    eleventyConfig.addFilter('post', filters.post);
    eleventyConfig.addFilter('tagIntro', filters.tagIntro);
    eleventyConfig.addFilter('hasTag', filters.hasTag);
    eleventyConfig.addFilter('humanDate', filters.humanDate);
    eleventyConfig.addFilter('humanDateTime', filters.humanDateTime);
    eleventyConfig.addFilter('isoDate', filters.isoDate);
    eleventyConfig.addFilter('responsiveHero', filters.responsiveHero);
    eleventyConfig.addFilter('imgAspectRatio', filters.imgAspectRatio);
    eleventyConfig.addFilter('authorEmail', filters.authorEmail);
    eleventyConfig.addFilter('authorName', filters.authorName);
    eleventyConfig.addFilter('indicateModifiedDate', filters.indicateModifiedDate);
    eleventyConfig.addFilter('modifiedDate', filters.modifiedDate);
    eleventyConfig.addFilter('tagUrl', filters.tagUrl);
    eleventyConfig.addFilter('tagColor', filters.tagColor);
}

function addBrowserSync404(eleventyConfig) {
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, bs) {

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