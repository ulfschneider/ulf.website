const { parse } = require('node-html-parser');
const utils = require('./utils.js');

const fitMedia = function (md) {

    md.core.ruler.push('media', state => {

        const tokens = state.tokens;

        tokens
            .filter(token => token.type == 'html_block')
            .forEach(token => {

                let html = parse(token.content);
                let iframes = html.querySelectorAll('iframe');

                for (let iframe of iframes) {
                    let attr = iframe.rawAttrs;
                    let width = parseInt(utils.widthAttr(attr));
                    let height = parseInt(utils.heightAttr(attr));
                    
                    if (width > 0 && height > 0) {
                        let orig = iframe.toString();
                        iframe.removeAttribute('height');
                        iframe.removeAttribute('width');
                        iframe.setAttribute('style', 'position:absolute; top:0; left:0; width:100%; height:100%;');
    
                        const padding = height / width * 100 + '%';
                        token.content = token.content.replace(orig, `<div style="position:relative; width:100%; height:0%; padding-bottom:${padding};">${iframe.toString()}</div>`);
                    }

                }
            });
    });
}

module.exports = {
    fit: fitMedia
}