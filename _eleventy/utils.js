const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTableOfContents = require('markdown-it-toc-done-right');
const markdownItDefList = require('markdown-it-deflist');
const markdownItFitMedia = require('markdown-it-fitmedia');
const markdownItScrollTable = require('markdown-it-scrolltable');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItFootnote = require('markdown-it-footnote');

const cheerio = require('cheerio');
const stripHtml = require('string-strip-html');
const path = require('path');

const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc);
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(timezone);


const site = require('../_data/site.js');

function siteTagsFromTagNav() {
    let siteTags = site.tagnav;
    if (!siteTags || siteTags && !siteTags.length) {
        return [];
    } else {
        return siteTags.map(v => {
            if (typeof v == 'string' || v instanceof String) {
                return v;
            } else {
                return v.tag;
            }
        });
    }
}

module.exports = {

    excerptFromItem: function(item) {
        let excerpt = this.removeHtml(item.templateContent);
        if (excerpt) {
            excerpt = excerpt.split(' ')
                .slice(0, site.excerptWordCount ? site.excerptWordCount : 25)
                .join(' ');
        }
        return excerpt;
    },

    firstImageTag: function(html) {

        if (html) {
            const match = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/);
            if (match) {
                return match[0];
            }
        }
    },

    getAttr: function(html, attr) {
        if (html) {
            const match = html.match(new RegExp(`${attr}="(.*?)"`));
            if (match) {
                return match[1];
            }
        }
    },

    srcAttr: function(html) {
        return this.getAttr(html, 'src');
    },

    srcsetAttr: function(html) {
        return this.getAttr(html, 'srcset');
    },

    altAttr: function(html) {
        return this.getAttr(html, 'alt');
    },

    widthAttr: function(html) {
        return this.getAttr(html, 'width');
    },

    heightAttr: function(html) {
        return this.getAttr(html, 'height');
    },

    isLiveItem: function(item) {
        const now = new Date();
        return  item.date <= now &&
            item.data.draft !== true &&
            item.data.draft !== 'yes';
    },

    tagUrl: function(tag) {
        let standard = {
            tag: '*',
            url: '*'
        };
        let empty = {
            tag: '',
            url: ''
        };
        let siteTags = site.tagnav;
        if (siteTags) {
            for (let v of siteTags) {
                if (typeof v != 'string' && !(v instanceof String)) {
                    if (v.tag == tag) {
                        return v.url;
                    }
                    if (v.tag == '*') {
                        standard = v;
                    }
                    if (!v.tag) {
                        empty = v;
                    }
                }
            }
        }

        if (tag == '') {
            return empty.url;
        } else {
            return standard.url.replace(/\*/g, tag);
        }
    },

    siteTagsFromTagNav: function() {
        return siteTagsFromTagNav()
    },

    hasSiteTag: function(item) {
        let siteTags = siteTagsFromTagNav();
        if (!siteTags.length) {
            return true;
        }
        if (item.data.tags) {
            for (let tag of item.data.tags) {
                if (siteTags.includes(tag)) {
                    return true;
                }
            }
        }
        return false;
    },

    hasSiteTagOrNoTag: function(item) {
        let siteTags = siteTagsFromTagNav();
        if (!siteTags.length) {
            return true;
        }
        if (item.data.tags) {
            for (let tag of item.data.tags) {
                if (siteTags.includes(tag)) {
                    return true;
                }
            }
        } else {
            return true;
        }
        return false;
    },

    isSearchAble: function(item) {
        if (item.templateContent && item.templateContent.trim()) {
            return item.data.nosearch == null;
        }
        return false;
    },

    removeHtml: function(text) {
        const $ = cheerio.load(text);

        //remove anchors
        $('a.anchor').each(function() {
            $(this).remove();
        });
        return stripHtml($('body').html());
    },

    mapItem: function(item) {
        return {
            id: item.url,
            title: item.data.title,
            date: item.date,
            humanDate: this.humanDate(item.date),
            abstract: item.data.abstract,
            author: item.data.author,
            layout: item.data.layout,
            tags: item.data.tags,
            notags: item.data.notags,
            content: this.removeHtml(item.templateContent)
        }
    },

    compareItemDate: function(a, b) {
        return a.date - b.date;
    },

    compareInputFileName: function(a, b) {
        const aFileName = path.basename(a.inputPath);
        const bFileName = path.basename(b.inputPath);
        return aFileName.localeCompare(bFileName);
    },

    isoDate: function(d) {
        return dayjs(d).toISOString();
    },

    humanDate: function(d) {
        if (d) {
            const locale = site.locale ? site.locale : 'en';
            let dt = dayjs(d).locale(locale);
            return dt.format('MMM Do, YYYY')
        } else {
            return '';
        }
    },

    humanDateTime: function(d) {
        if (d) {
            const locale = site.locale ? site.locale : 'en';
            let dt = dayjs(d).locale(locale);
            return dt.format('ddd, MMM Do, YYYY hh:mm a Z');
        } else {
            return '';
        }
    },

    extractTags: function(collection) {
        let tagSet = new Set();
        for (let post of collection.getAll().filter(this.isLiveItem)) {
            if (post.data.tags) {
                for (let tag of post.data.tags) {
                    tagSet.add(tag);
                }
            }
        }
        return [...tagSet].sort();
    },

    getMarkdownLib: function() {
        const mdlib = markdownIt({
                html: true,
                breaks: true,
                linkify: true,
                typographer: true
            })
            .use(markdownItAnchor, {
                permalink: true,
                permalinkClass: 'anchor',
                permalinkSymbol: '#',
                permalinkBefore: false,
                permalinkSpace: true
            })
            .use(markdownItTableOfContents)
            .use(markdownItDefList)
            .use(markdownItFitMedia, {
                imgDir: './content'
            })
            .use(markdownItScrollTable)
            .use(markdownItAttrs)
            .use(markdownItFootnote);

        return mdlib;
    }

}