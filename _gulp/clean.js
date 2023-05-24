const del = require('del');
const site = require('../_data/site.js');


const clean = () => {
  console.log(`Cleaning up ${site.output}`);
  return del(site.output);
};

module.exports = clean;
