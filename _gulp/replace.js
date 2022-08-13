const rs = require('replacestream');
const through = require('through2');
const site = require('../_data/site.js');
const utils = require('../_eleventy/utils.js');

const replacements = [
    {
        search: '{{theme_color}}',
        replace: site.theme_color
    },
    {
        search: '{{background_color}}',
        replace: site.background_color
    },
    {
        search: '{{offline}}',
        replace: site.offline
    },
    {
        search: '{{base}}',
        replace: utils.getBase()
    },
    {
        search: '{{trimBase}}',
        replace: utils.getTrimBase()
    }
]


function replace() {
    function log(file, search, replace) {
        console.log(`Replacing ${search} with ${replace ? replace : '""'} in ${file.relative}`);
    }


    return through.obj(function (file, encoding, callback) {
        if (file.isStream()) {
            for (let r of replacements) {
                const replaceFunction = function (match) {
                    log(file, r.search, r.replace);
                    return r.replace;
                }
                file.contents = file.contents.pipe(rs(r.search, replaceFunction));
            }

            return callback(null, file);
        }
        if (file.isBuffer()) {
            let contents = String(file.contents);
            for (let r of replacements) {
                let idx = 0;
                while (idx = contents.indexOf(r.search, idx) >= 0) {
                    log(file, r.search, r.replace);
                    idx = idx + r.replace.length;
                    contents = contents.replace(r.search, r.replace);
                }
            }

            file.contents = Buffer.from(contents);
            return callback(null, file);
        }

        callback(null, file);
    });
}

module.exports = replace;
