const { parse } = require('node-html-parser');
const sizeOf = require('image-size');
const utils = require('./utils.js');



const fitVid = function (md) {

    md.core.ruler.push('fit-vid', state => {

        const tokens = state.tokens;

        tokens
            .filter(token => token.type == 'html_block')
            .forEach(token => {

                let html = parse(token.content);
                let iframes = html.querySelectorAll('iframe');

                if (iframes.length) {
                    token.content = html.toString();
                }

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
                        const fitWrapper = `<div class="fit-media" style="position:relative; height:0; padding-bottom:${padding};">${iframe.toString()}</div>`;
                        const idx = token.content.indexOf(orig);
                        if (idx >= 0) {
                            token.content = token.content.substring(0, idx) + fitWrapper + token.content.substring(idx + orig.length);
                        }
                    }
                }
            });
    });
}


const hasParentTag = function (node, tag) {
    let parent = node.parentNode;

    if (parent == null) {
        return false;
    } else if (parent.tagName == tag) {
        return true;
    } else {
        return hasParentTag(parent, tag);
    }
}

const fitImg = function (md) {

    //get html blocks
    md.core.ruler.push('fit-img', state => {

        const tokens = state.tokens;

        tokens
            .filter(token => token.type == 'html_block')
            .forEach(token => {
                let html = parse(token.content);
                let imgs = html.querySelectorAll('img');

                if (imgs.length) {
                    token.content = html.toString();
                }

                for (let img of imgs) {
                    if (!hasParentTag(img, 'picture')) {
                        let attr = img.rawAttrs;
                        let src = utils.srcAttr(attr);
                        if (src) {
                            let dimensions = sizeOf(`./content${src}`);
                            const height = dimensions.height;
                            const width = dimensions.width;
                            if (height > 0 && width > 0) {
                                let orig = img.toString();
                                img.removeAttribute('height');
                                img.removeAttribute('width');
                                img.setAttribute('style', 'position:absolute; top:0; left:0; width:100%; height:100%;');
                                const padding = height / width * 100 + '%';
                                const fitWrapper = `<div class="fit-media" style="position:relative; height:0; padding-bottom:${padding};">${img.toString()}</div>`;
                                const idx = token.content.indexOf(orig);
                                if (idx >= 0) {
                                    token.content = token.content.substring(0, idx) + fitWrapper + token.content.substring(idx + orig.length);
                                }
                            }
                        }
                    }
                }
            });
    });

    //get markdown
    let defaultRender = md.renderer.rules.image;
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
        /*
        let aIndex = tokens[idx].attrIndex('loading');
    
        if (aIndex < 0) {
            tokens[idx].attrPush(['loading', 'lazy']); // add new attribute
        } else {
            tokens[idx].attrs[aIndex][1] = 'lazy';    // replace value of existing attr
        }
    
        // pass token to default renderer.
        */
        return defaultRender(tokens, idx, options, env, self);
    };

}



module.exports = function (md) {
    fitVid(md);
    //fitImg(md);
}