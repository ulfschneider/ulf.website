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

    firstImageTag: function (item) {
        const content = item.templateContent;
        if (content) {
            const match = content.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/);
            if (match) {
                return match[0];
            }
        }
    },

    imageSrc: function (img) {
        if (img) {
            const match = img.match(/src="(.*?)"/);
            if (match) {
                return match[1];
            }
        }
    },

    imageAlt: function (img) {
        if (img) {
            const match = img.match(/alt="(.*?)"/);
            if (match) {
                return match[1];
            }
        }
    },

    isLiveItem: function (item) {
        const now = new Date();
        return item.date <= now
            && item.data.published !== false
            && item.data.published !== 'no'
            && item.data.draft !== true
            && item.data.draft !== 'yes';
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