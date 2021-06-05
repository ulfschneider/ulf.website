const del = require('del');

const OUTPUT = [process.env.OUTPUT ? process.env.OUTPUT : '_site'];

const clean = () => {
    console.log(`Cleaning up ${OUTPUT}`);
    return del(OUTPUT);
};

module.exports = clean;