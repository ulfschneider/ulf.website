const rss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginEmbedTweet = require('eleventy-plugin-embed-tweet');

const fs = require('fs');

const site = require('./_data/site.js');
const utils = require('./_eleventy/utils.js');
const filters = require('./_eleventy/filters.js');
const transforms = require('./_eleventy/transforms.js');
const { filter } = require('domutils');

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
    eleventyConfig.addLiquidFilter("dateToRfc3339", rss.dateToRfc3339);
    eleventyConfig.addLiquidFilter("dateToRfc822", rss.dateToRfc822);

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
        cacheDirectory: '_tweets', /* Cache tweets in the _tweets folder */
        useInlineStyles: true, /*use the default styling*/
        autoEmbed: true /*allow to embed a tweet by writing the URL within a single line in your Markdown */
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
    //live content
    eleventyConfig.addCollection('liveContent', async collectionAPI => {
        console.log('Derive live content');
        return collectionAPI.getFilteredByGlob(['content/**'])
            .filter(utils.isLiveItem)
            .map(item => {
                item.data.indicateModifiedDate = filters.indicateModifiedDate(item);
                item.data.modifiedDate = filters.modifiedDate(item);
                return item;
            })
            .sort(utils.compareItemDate)
            .reverse()
            ;
    });
    /*//home content
    eleventyConfig.addCollection('homeContent', async collectionAPI => {
        console.log('Derive home content');
        let homeContent = [...collectionAPI.getFilteredByGlob(['content/posts/**'])
            .filter(utils.isLiveItem)
            .map(item => {
                item.data.indicateModifiedDate = filters.indicateModifiedDate(item);
                item.data.modifiedDate = filters.modifiedDate(item);
                return item;
            })
            .sort(utils.compareItemDate)
            .reverse()].slice(0, 1);
        homeContent[0].url = site.base;
        homeContent[0].data.id = 'home';
        homeContent[0].outputPath = site.output + site.base + 'index.html';

        return homeContent;
    });*/
    //tag intros
    eleventyConfig.addCollection('tagIntros', collectionAPI => {
        console.log('Derive tag intros');
        return collectionAPI.getFilteredByGlob('content/tagintros/**')
            .map(item => {
                item.data.indicateModifiedDate = filters.indicateModifiedDate(item);
                item.data.modifiedDate = filters.modifiedDate(item);
                return item;
            });
    });
    //used site tags
    eleventyConfig.addCollection('usedSiteTags', collectionAPI => {
        console.log('Derive used site tags');
        let usedSiteTags = utils.extractTags([
            ...collectionAPI.getFilteredByGlob('content/posts/**')
                .map(item => {
                    if (item.data?.tags?.includes(site.starTag)) {
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
    //double pagination
    eleventyConfig.addCollection('doublePagination', collectionAPI => {
        console.log('Derive double pagination');
        let items = collectionAPI.getFilteredByGlob('content/posts/**')
            .map(item => {
                if (item.data?.tags?.includes(site.starTag)) {
                    item.data.starred = site.starTag;
                } else {
                    item.data.starred = '';
                }
                return item;
            })
            .filter(utils.isLiveItem)
            .sort(utils.compareItemDate)
            .reverse();

        let tagMap = [];
        let pagedItems = utils.chunk(items, site.paginationSize);
        for (let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
            tagMap.push({
                tag: '',
                title: 'All posts',
                pageNumber: pageNumber,
                humanPageNumber: pageNumber + 1,
                permalink: utils.currentPage(site.blog, pageNumber),
                newest: utils.currentPage(site.blog),
                newer: utils.newerPage(site.blog, pageNumber),
                older: utils.olderPage(site.blog, pageNumber, max),
                oldest: utils.oldestPage(site.blog, max),
                itemCount: items.length,
                pageCount: pagedItems.length,
                pageData: pagedItems[pageNumber]
            });
        }

        let usedSiteTags = utils.extractTags(items);
        for (let tagName of usedSiteTags) {
            let tagItems = collectionAPI.getFilteredByTag(tagName)
                .filter(utils.isLiveItem)
                .filter(utils.isPost)
                .sort(utils.compareItemDate)
                .reverse();
            let pagedItems = utils.chunk(tagItems, site.paginationSize);

            for (let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
                tagMap.push({
                    tag: tagName,
                    pageNumber: pageNumber,
                    humanPageNumber: pageNumber + 1,
                    permalink: utils.currentPage(`${site.blog}${tagName}/`, pageNumber),
                    newest: utils.currentPage(`${site.blog}${tagName}/`),
                    newer: utils.newerPage(`${site.blog}${tagName}/`, pageNumber),
                    older: utils.olderPage(`${site.blog}${tagName}/`, pageNumber, max),
                    oldest: utils.oldestPage(`${site.blog}${tagName}/`, max),
                    itemCount: tagItems.length,
                    pageCount: pagedItems.length,
                    pageData: pagedItems[pageNumber]
                });
            }
        }

        return tagMap;
    });
}

function addFilters(eleventyConfig) {
    eleventyConfig.addFilter('searchIndex', filters.searchIndex);
    eleventyConfig.addFilter('firstImage', filters.firstImage);
    eleventyConfig.addFilter('live', filters.live);
    eleventyConfig.addFilter('post', filters.post);
    eleventyConfig.addFilter('hasTag', filters.hasTag);
    eleventyConfig.addFilter('tagIntro', filters.tagIntro);
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