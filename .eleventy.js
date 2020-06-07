const rss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItDefList = require('markdown-it-deflist');
const markdownItFitMedia = require('markdown-it-fitmedia');

const site = require('./_data/site.js');
const utils = require('./_eleventy/utils.js');
const filters = require('./_eleventy/filters.js');


const cheerio = require('cheerio');
const sizeOf = require('image-size');

function getDimensions(src, fitMediaOptions) {
    if (fitMediaOptions.imgDir) {
        return sizeOf(`${fitMediaOptions.imgDir}${src}`);
    } else {
        return sizeOf(src);
    }
}

function replaceInlineTag(source, tag, replacement) {
    if (source && replacement) {
        if (source && replacement) {
            let regex = new RegExp(`<${tag}.*>`, 'i');
            return source.replace(regex, replacement);
        }
    }
    return source;
}

function styleAspectRatio(style, width, height) {
    if (style) {
        if (!/;\s*$/.test(style)) {
            style += '; ';
        }
        style += `aspect-ratio:${width}/${height};`;
    } else {
        style = `aspect-ratio:${width}/${height};`;
    }
    return style;
}


function hasParentTag(node, tag) {
    let parent = node.parent;
    if (parent == null) {
        return false;
    } else if (parent.name == tag) {
        return true;
    } else {
        return hasParentTag(parent, tag);
    }
}

function isWrappedInPicture(node) {
    return hasParentTag(node, 'picture');
}


function fitWrapHtmlElements(token, tagName, fitMediaOptions) {
    try {
        let $ = cheerio.load(token.content);
        let elements = $(tagName);

        if (elements.length) {
            elements.each(function (i, element) {

                let width = parseInt($(element).attr('width'));
                let height = parseInt($(element).attr('height'));
                if (width > 0 && height > 0) {
                    $(element).removeAttr('height');
                    $(element).removeAttr('width');

                    let style = $(element).attr('style');
                    if (style) {
                        if (!/;\s*$/.test(style)) {
                            style += '; ';
                        }
                        style += 'position:absolute; top:0; left:0; width:100%; height:100%;';
                    } else {
                        style = 'position:absolute; top:0; left:0; width:100%; height:100%;';
                    }
                    $(element).attr('style', style);

                    const padding = height / width * 100 + '%';
                    let wrapperStyle = `position:relative; height:0; padding-bottom:${padding};`;
                    if (fitMediaOptions.aspectRatio) {
                        wrapperStyle = styleAspectRatio(wrapperStyle, width, height);
                    }
                    const fitWrapper = $(`<div class="fit-media" style="${wrapperStyle}"></div>`);
                    $(element).wrap(fitWrapper);
                }
                token.content = $.html();
            });
        }
    } catch (err) {
        console.error(`Failure when adjusting element ${err}`);
    }
}

function fitWrapElements(token, fitMediaOptions) {
    for (let element of fitMediaOptions.fitWrapElements) {
        fitWrapHtmlElements(token, element, fitMediaOptions);
    }
}


function adjustHtmlImgs(token, fitMediaOptions) {
    try {

        let $ = cheerio.load(token.content);
        let imgs = $('img').filter((idx, img) => !isWrappedInPicture(img));

        if (imgs.length) {
            imgs.each(function (i, img) {
                if (fitMediaOptions.lazyLoad) {
                    $(img).attr('loading', 'lazy');
                }

                if (fitMediaOptions.aspectRatio) {

                    let src = $(img).attr('src');
                    if (src) {
                        let dimensions = getDimensions(src, fitMediaOptions);
                        const height = dimensions.height;
                        const width = dimensions.width;
                        if (height > 0 && width > 0) {
                            let style = $(img).attr('style');
                            style = styleAspectRatio(style, width, height);
                            $(img).attr('style', style);
                        }
                    }
                }
                token.content = replaceInlineTag(token.content, 'img', $.html(img));
            });
        }
    } catch (err) {
        console.error(`Failure when adjusting imgo ${err}`);
    }
}

function adjustMarkdownImgs(md, fitMediaOptions) {
    const attr = function (token, key, value) {
        const idx = token.attrIndex(key);
        if (value == undefined) {
            //returning value            
            if (idx >= 0) {
                return token.attrs[idx][1]
            } else {
                return null;
            }
        } else {
            //setting value
            if (idx < 0) {
                //new attribute
                token.attrPush([key, value]);
            } else {
                //change existing attribute
                token.attrs[idx][1] = value;
            }
        }
    }

    let defaultRender = md.renderer.rules.image;
    md.renderer.rules.image = function (tokens, idx, options, env, self) {

        let img = tokens[idx];

        if (fitMediaOptions.lazyLoad) {
            attr(img, 'loading', 'lazy');
        }

        if (fitMediaOptions.aspectRatio) {
            try {
                src = attr(img, 'src');
                if (src) {
                    let dimensions = getDimensions(src, fitMediaOptions);
                    const height = dimensions.height;
                    const width = dimensions.width;
                    if (height > 0 && width > 0) {
                        let style = attr(img, 'style');
                        style = styleAspectRatio(style, width, height);
                        attr(img, 'style', style);
                    }
                }
            } catch (err) {
                console.error(`Failure when adjusting img ${err}`);
            }
        }

        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    }
}


function fitWrap(md, fitMediaOptions) {

    md.core.ruler.push('fit-wrap', state => {

        const tokens = state.tokens;

        tokens
            .filter(token => token.type == 'html_block')
            .forEach(token => fitWrapElements(token, fitMediaOptions));
    });
}

function fitImg(md, fitMediaOptions) {

    md.core.ruler.push('fit-img', state => {

        const tokens = state.tokens;

        tokens
            .filter(token => token.type == 'html_block' || token.type == 'html_inline')
            .forEach(token => adjustHtmlImgs(token, fitMediaOptions));
    });

    adjustMarkdownImgs(md, fitMediaOptions);
}


const fitMedia = function (md, fitMediaOptions) {
    fitMediaOptions = Object.assign({}, fitMedia.defaults, fitMediaOptions);
    fitImg(md, fitMediaOptions);
    fitWrap(md, fitMediaOptions);
}

fitMedia.defaults = {
    imgDir: '',
    lazyLoad: true,
    aspectRatio: true,
    fitWrapElements: ['iframe', 'video']
}

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
    }).use(markdownItDefList)
        .use(fitMedia, {
            imgDir: './content'
        });

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
