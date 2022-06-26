const { dest, src } = require('gulp');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const postcssCustomMedia = require('postcss-custom-media');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssCalc = require('postcss-calc');
const postcssPurgeCSS = require('@fullhuman/postcss-purgecss');
const cssNano = require('cssnano');
const site = require('../_data/site.js');


const SOURCE = ['_assets/css/main.css', '_assets/css/compose.css'];
const DEST = `${site.output}/css/`;

const processingCSS = () => {
    console.log(`Processing CSS from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(postcss([
            postcssImport(),
            postcssCustomMedia(),
            postcssCustomProperties(),
            postcssCalc(),
            postcssPurgeCSS({
                content: [
                    'content/pages/**/*',
                    'content/posts/**/*',
                    '!content/**/*compose.html',
                    '_includes/**/*',
                    '_layouts/**/*',
                    '_eleventy/**/*',
                    '_assets/js/**/*',
                    '_assets/css/customize.css'
                ],
                defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [] //check https://flaviocopes.com/tailwind-setup/
            }),
            cssNano()
        ]))
        .pipe(dest(DEST));
};

module.exports = processingCSS;