const stripHtml = require("string-strip-html");
const path = require("path");

module.exports = {

    excerptFromItem: function (item) {
        let excerpt = stripHtml(item.templateContent);
        if (excerpt) {
            excerpt = excerpt.split(' ')
                .slice(0, 25)
                .join(' ');
        }
        return excerpt;
    },

    firstImageTag: function (html) {

        if (html) {
            const match = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/);
            if (match) {
                return match[0];
            }
        }
    },

    getAttr: function (html, attr) {
        if (html) {
            const match = html.match(new RegExp(`${attr}="(.*?)"`));
            if (match) {
                return match[1];
            }
        }
    },

    srcAttr: function (html) {
        return this.getAttr(html, 'src');
    },

    srcsetAttr: function (html) {
        return this.getAttr(html, 'srcset');
    },

    altAttr: function (html) {
        return this.getAttr(html, 'alt');
    },

    widthAttr: function (html) {
        return this.getAttr(html, 'width');
    },

    heightAttr: function (html) {
        return this.getAttr(html, 'height');
    },

    isLiveItem: function (item) {
        const now = new Date();
        return item.date <= now
            && item.data.published !== false
            && item.data.published !== 'no'
            && item.data.draft !== true
            && item.data.draft !== 'yes';
    },

    isSearchAble: function (item) {
        return item.data.nosearch == null;
    },

    mapItem: function (item) {
        return {
            id: item.url,
            title: item.data.title,
            date: item.date,
            subtitle: item.data.subtitle,
            abstract: item.data.abstract,
            author: item.data.author,
            refer: item.data.refer,
            layout: item.data.layout,
            content: stripHtml(item.templateContent)
        }
    },

    compareItemDate: function (a, b) {
        return a.date - b.date;
    },

    compareInputFileName: function (a, b) {
        const aFileName = path.basename(a.inputPath);
        const bFileName = path.basename(b.inputPath);
        return aFileName.localeCompare(bFileName);
    }
}