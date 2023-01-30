const htmlmin = require("html-minifier");

module.exports = {
    'htmlmin': function (content) {
        console.log(this.outputPath);
        if (this.outputPath.endsWith(".html")) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
            });
            return minified;
        }

        return content;
    }
}