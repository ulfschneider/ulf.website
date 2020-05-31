const cheerio = require('cheerio');
const sizeOf = require('image-size');

function getDimensions(src, fitMediaOptions) {
    if (fitMediaOptions.imgDir) {
        return sizeOf(`${fitMediaOptions.imgDir}${src}`);
    } else {
        return sizeOf(src);
    }
}

function styleAspectRatio(style, width, height) {
    if (style) {
        style += `; aspect-ratio:${width / height};`;
    } else {
        style = `aspect-ratio:${width / height};`;
    }
    return style;
}


function hasParentTag(node, tag) {
    let parent = node.parent;
    if (parent == null) {
        return false;
    } else if (parent.name == tag) {
        return true;
    } else {
        return hasParentTag(parent, tag);
    }
}

function isWrappedInPicture(node) {
    return hasParentTag(node, 'picture');
}


function fitWrapHtmlElements(token, tagName) {
    try {
        let $ = cheerio.load(token.content);
        let elements = $(tagName);

        if (elements.length) {
            elements.each(function (i, element) {

                let width = parseInt($(element).attr('width'));
                let height = parseInt($(element).attr('height'));
                if (width > 0 && height > 0) {
                    $(element).removeAttr('height');
                    $(element).removeAttr('width');

                    let style = $(element).attr('style');
                    if (style) {
                        style += '; position:absolute; top:0; left:0; width:100%; height:100%;';
                    } else {
                        style = 'position:absolute; top:0; left:0; width:100%; height:100%;';
                    }
                    $(element).attr('style', style);

                    const padding = height / width * 100 + '%';
                    const fitWrapper = $(`<div class="fit-media" style="position:relative; height:0; padding-bottom:${padding};"></div>`);
                    $(element).wrap(fitWrapper);
                }

            });
            token.content = $.html();
        }
    } catch (err) {
        console.error(`Failure when adjusting element ${err}`);
    }
}

function fitWrapElements(token, fitMediaOptions) {
    for (let element of fitMediaOptions.fitWrapElements) {
        fitWrapHtmlElements(token, element);
    }
}


function adjustHtmlImgs(token, fitMediaOptions) {
    try {
        let $ = cheerio.load(token.content);

        let imgs = $('img').filter((idx, img) => !isWrappedInPicture(img));

        if (imgs.length) {
            imgs.each(function (i, img) {

                if (fitMediaOptions.lazyLoad) {
                    $(img).attr('loading', 'lazy');
                }

                if (fitMediaOptions.aspectRatio) {

                    let src = $(img).attr('src');
                    if (src) {
                        let dimensions = getDimensions(src, fitMediaOptions);
                        const height = dimensions.height;
                        const width = dimensions.width;
                        if (height > 0 && width > 0) {
                            $(img).removeAttr('height');
                            $(img).removeAttr('width');

                            let style = $(img).attr('style');
                            style = styleAspectRatio(style, width, height);
                            $(img).attr('style', style);
                        }
                    }

                }

            });
            token.content = $.html();
        }
    } catch (err) {
        console.error(`Failure when adjusting imgo ${err}`);
    }
}

function adjustMarkdownImgs(md, fitMediaOptions) {
    const attr = function (token, key, value) {
        const idx = token.attrIndex(key);
        if (value == undefined) {
            //returning value            
            if (idx >= 0) {
                return token.attrs[idx][1]
            } else {
                return null;
            }
        } else {
            //setting value
            if (idx < 0) {
                //new attribute
                token.attrPush([key, value]);
            } else {
                //change existing attribute
                token.attrs[idx][1] = value;
            }
        }
    }

    let defaultRender = md.renderer.rules.image;
    md.renderer.rules.image = function (tokens, idx, options, env, self) {

        let img = tokens[idx];

        if (fitMediaOptions.lazyLoad) {
            attr(img, 'loading', 'lazy');
        }

        if (fitMediaOptions.aspectRatio) {
            try {
                src = attr(img, 'src');
                if (src) {
                    let dimensions = getDimensions(src, fitMediaOptions);
                    const height = dimensions.height;
                    const width = dimensions.width;
                    if (height > 0 && width > 0) {
                        let style = attr(img, 'style');
                        style = styleAspectRatio(style, width, height);
                        attr(img, 'style', style);
                    }
                }
            } catch (err) {
                console.error(`Failure when adjusting img ${err}`);
            }
        }

        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self);
    }
}


function fitWrap(md, fitMediaOptions) {

    md.core.ruler.push('fit-wrap', state => {

        const tokens = state.tokens;

        tokens
            .filter(token => token.type == 'html_block')
            .forEach(token => fitWrapElements(token, fitMediaOptions));
    });
}

function fitImg(md, fitMediaOptions) {

    md.core.ruler.push('fit-img', state => {

        const tokens = state.tokens;

        tokens
            .filter(token => token.type == 'html_block')
            .forEach(token => adjustHtmlImgs(token, fitMediaOptions));
    });

    adjustMarkdownImgs(md, fitMediaOptions);

}


const fitMedia = function (md, fitMediaOptions) {
    fitMediaOptions = Object.assign({}, fitMedia.defaults, fitMediaOptions);
    fitImg(md, fitMediaOptions);
    fitWrap(md, fitMediaOptions);
}

fitMedia.defaults = {
    imgDir: '',
    lazyLoad: true,
    aspectRatio: true,
    fitWrapElements: ['iframe', 'video']
}

module.exports = fitMedia;

