const { dest, src } = require('gulp');

const OUTPUT = process.env.OUTPUT ? process.env.OUTPUT : '_site';
const SOURCE = ['node_modules/compose-css/css/compose.css'];
const DEST = `${OUTPUT}/css/`;

const processingCompose = () => {
    console.log(`Processing Compose-CSS from ${SOURCE} into ${DEST}`);
    return src(SOURCE)
        .pipe(dest(DEST));
};

module.exports = processingCompose;