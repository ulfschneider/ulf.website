const { parse } = require('node-html-parser');
const utils = require('./utils.js');



const fitVid = function (md) {

    md.core.ruler.push('fit-vid', state => {

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
                        iframe.setAttribute('loading', 'lazy');
                        const padding = height / width * 100 + '%';
                        token.content = token.content.replace(orig, `<div style="position:relative; width:100%; height:0%; padding-bottom:${padding};">${iframe.toString()}</div>`);
                    }
                }
            });
    });
}

const fitImg = function (md) {

    //get html blocks
    md.core.ruler.push('fit-img', state => {

        const tokens = state.tokens;

        tokens
            .filter(token => token.type == 'html_block')
            .forEach(token => {
                if (token.type == 'image') {
                    console.log(token.content);
                }
                let html = parse(token.content);
                let imgs = html.querySelectorAll('img');
                for (let img of imgs) {
                    img.setAttribute('loading', 'lazy');
                }

                token.content = html.toString();
            });
    });

    //get markdown
    let defaultRender = md.renderer.rules.image;
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
        let aIndex = tokens[idx].attrIndex('loading');

        
        if (aIndex < 0) {
            tokens[idx].attrPush(['loading', 'lazy']); // add new attribute
        } else {
            tokens[idx].attrs[aIndex][1] = 'lazy';    // replace value of existing attr
        }

        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    };

}



const fitMedia = function (md) {
    fitVid(md);
    //fitImg(md);
}

module.exports = {
    fit: fitMedia
}