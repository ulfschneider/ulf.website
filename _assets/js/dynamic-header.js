/**
 * DynamicHeader
 *
 * A dynamic header for web pages.
 * 
 * Please download the repo and open the file <code>index.html</code> to see the usage.
 * 
 * Install DynamicHeader in your Node project with 
 * <pre>
 * npm i dheader
 * </pre>
 * 
 * and use it inside your code via 
 * 
 * <pre>
 * const DynamicHeader = require('dheader');
 * </pre>
 * 
 * or, alternatively 
 * 
 * <pre>
 * import DynamicHeader from 'dheader';
 * </pre>
 * 
 * You can also use it without node, by embedding the script <code>dynamic-header.min.js</code> in your web page.
 * 
 * <pre>
 * &lt;script src="dynamic-header.min.js">&lt;/script>
 * </pre> 
 *  Without any arguments, <code>DynamicHeader.init()</code> will search for a container
 *  with <code>id="header"</code> or a tag <code>header</code> and will make that container the dynamic header.
 */
DynamicHeader = (function () {
    const TRANSITION = '0.2s linear';
    const TRIM_ID = 'dynamic-header-trim';
    //state
    let config;
    let lastScrollTop = getScrollTop();
    let header, trim;
    let initialHeaderStyle;
    let pauseStart;
    let afterBurner;
    let dynamic;

    function getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    }
    function getHeaderOffsetTop() {
        let trimOffset = getTrimOffsetTop();
        if (trimOffset) {
            return trimOffset;
        } else {
            return header.offsetTop;
        }
    }
    function setHeaderTop(top) {
        if (top < 0) {
            setHeaderInvisible();
        } else {
            setHeaderVisible();
        }
        header.style.top = top + 'px';
    }
    function hasHeaderTop() {
        return header.style.top;
    }
    function isHeaderFixed() {
        return header.style.position == 'fixed';
    }
    function getHeaderTop() {
        return parseInt(header.style.top);
    }
    function getHeaderHeight() {
        return header.offsetHeight;
    }
    function getTrimOffsetTop() {
        return trim ? trim.offsetTop : 0;
    }
    function getHeaderOffsetBottom() {
        return getHeaderOffsetTop() + getHeaderHeight();
    }
    function isHeaderHidden() {
        if (isDynamic()) {
            return getHeaderTop() + getHeaderHeight() <= 0;
        } else {
            return getHeaderOffsetBottom() < getScrollTop();
        }
    }
    function isHeaderMovedAway() {
        return isDynamic() && getHeaderTop() < 0;
    }
    function setHeaderInvisible() {
        header.style.visibility = 'hidden';
    }
    function setHeaderVisible() {
        header.style.visibility = 'visible';
    }
    function isDynamic() {
        return dynamic && hasHeaderTop() && isHeaderFixed();
    }
    function controlDynamic() {
        if (!isDynamic() && config.fixed && getHeaderOffsetTop() <= getScrollTop()) {
            setHeaderTop(0);
            modifyHeaderStyle();
            dynamic = true;
        } else if (!isDynamic() && getHeaderOffsetBottom() < getScrollTop()) {
            setHeaderTop(- getHeaderHeight());
            modifyHeaderStyle();
            dynamic = true;
        } else if ((dynamic && getHeaderOffsetTop() >= getScrollTop())
            || (isHeaderMovedAway() && getHeaderHeight() >= getScrollTop())) {
            if (!config.fixed || (config.fixed && getHeaderOffsetTop() > 0)) {
                restoreHeaderStyle();
                dynamic = false;
            }
        }
        if (!isDynamic()) {
            setHeaderVisible();
            removeClassFromHeader(config.slideIn);
        } else if (!config.fixed && getScrollTop() <= config.delta) {
            if (afterBurner) {
                clearTimeout(afterBurner);
            }
            afterBurner = setTimeout(controlDynamic, 500);
        }
    }

    function storeHeaderStyle() {
        initialHeaderStyle = {};
        initialHeaderStyle.transition = header.style.transition;
        initialHeaderStyle.position = header.style.position;
        initialHeaderStyle.left = header.style.left;
        initialHeaderStyle.top = header.style.top;
        initialHeaderStyle.right = header.style.right;
        initialHeaderStyle.visibility = header.style.visibility;
    }

    function restoreHeaderStyle() {
        removeClassFromHeader('is-dynamic');
        if (initialHeaderStyle) {
            header.style.transition = initialHeaderStyle.transition;
            header.style.position = initialHeaderStyle.position;
            header.style.left = initialHeaderStyle.left;
            header.style.top = initialHeaderStyle.top;
            header.style.right = initialHeaderStyle.right;
            header.style.visibility = initialHeaderStyle.visibility;
        }
        removeTrim();
    }

    function modifyHeaderStyle() {
        trimHeader();
        header.style.transition = TRANSITION;
        header.style.position = 'fixed';
        header.style.left = '0';
        header.style.right = '0';
        addClassToHeader('is-dynamic');
    }


    function selectHeader() {
        if (config.headerId) {
            header = document.querySelector(config.headerId);
        }

        if (!header) {
            throw ('Header with selector=[' + config.headerId + '] could not be found');
        }

        storeHeaderStyle();
        return header;
    }

    function trimHeader(trimHeight) {
        insertTrim();
        if (trim) {
            if (trimHeight) {
                trim.style.height = trimHeight;
            } else {
                trim.style.height = getHeaderHeight() + 'px';
            }
        }
    }

    function insertTrim() {
        if (!trim) {
            trim = document.getElementById(TRIM_ID);
            if (!trim) {
                var parent = header.parentElement;
                trim = document.createElement("div");
            }
            trim.id = TRIM_ID;
            parent.insertBefore(trim, header);
        }
        return trim;
    }

    function removeTrim() {
        if (trim) {
            trim.remove();
        }
        trim = null;
    }

    function addClassToHeader(cssClass) {
        if (cssClass) {
            header.classList.add(cssClass);
        }
    }

    function removeClassFromHeader(cssClass) {
        if (cssClass) {
            header.classList.remove(cssClass);
        }
    }

    function showHeader() {
        if (isHeaderMovedAway()) {
            setHeaderTop(0);
            addClassToHeader(config.slideIn);
            callback();
        }
    }

    function hideHeader(distance) {
        if (!config.fixed && isDynamic()) {
            let wasHidden = isHeaderMovedAway();

            if (!wasHidden || !isHeaderHidden()) {
                let headerHeight = getHeaderHeight();
                if (distance) {
                    setHeaderTop(-Math.abs(distance));
                } else {
                    setHeaderTop(-headerHeight);
                }
                if (!wasHidden) {
                    removeClassFromHeader(config.slideIn);
                    callback();
                }
            }
        }
    }

    function startPause() {
        pauseStart = (new Date()).getTime();
    }

    function clearPause() {
        pauseStart = 0;
    }

    function isPaused() {
        let now = (new Date()).getTime();
        return (now - pauseStart <= config.pauseDuration);
    }

    function startTimedAction(action) {
        startPause();
        setTimeout(action ? action : hideHeader, config.pauseDuration);
    }

    function moveHeader() {
        if (!config.fixed && !isPaused() && isDynamic()) {
            let scrollTop = getScrollTop();

            if (Math.abs(lastScrollTop - scrollTop) <= config.delta) {
                return;
            }

            if (scrollTop > lastScrollTop) {
                // if scrolling down 
                // move the header out of the way
                hideHeader();
            } else if (scrollTop < lastScrollTop) {
                showHeader();
            }
            lastScrollTop = scrollTop;
        }

    }

    function onResize() {
        controlDynamic();
        if (isDynamic()) {
            hideHeader();
            trimHeader();
        }
    }

    function onScroll() {
        controlDynamic();
        moveHeader();
    }

    function onClick() {
        controlDynamic();
        lastScrollTop = getScrollTop();
        if (config.hideOnClick && !config.fixed && isDynamic()) {
            startTimedAction();
        }
    }

    function onLoad() {
        selectHeader();
        controlDynamic();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll);
        header.addEventListener('click', onClick);
    }

    function callback() {
        if (config.callback) {
            config.callback(header);
        }
    }

    function cleanUp() {
        clearPause();
        if (header) {
            restoreHeaderStyle();
        }
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('load', onLoad);
        if (header) {
            header.removeEventListener('click', onClick);
        }
        initialHeaderStyle = null;
        lastScrollTop = getScrollTop();
        header = null;
        dynamic = false;
    }

    function transferConfig(settings) {
        config = Object.assign({
            headerId: 'header',
            fixed: false,
            pauseDuration: 250,
            hideOnClick: false,
            delta: 100,
            slideIn: 'slide-in'
        }, settings);
    }

    //public API
    return {
        init: function (settings) {
            cleanUp();
            transferConfig(settings);
            if (document.readyState == 'complete') {
                onLoad();
            } else {
                window.addEventListener('load', onLoad);
            }
        },
        destroy: function () {
            cleanUp();
        }
    }
})();

//////// Node Module Interface

try {
    if (module) {
        module.exports = {
            /**
             * @param {Object} [settings]
             * @param {String} [settings.headerId] - Specify the selector of the container you want to make the dynamic header. 
            *  @param {Number} [settings.delta] -  The number of pixels a user need to scroll at least in order to make DynamicHeader react on scrolling. 
            *  @param {Boolean} [settings.fixed] - If set to true, the header will never slide out of the way.
            *  @param {Boolean} [settings.hideOnClick] - If set to true, the header will slide out of the way when a click occurred inside the header. Will be ignored when config.fixed is true.
            *  @param {Number} [settings.pauseDuration] - When the header is hidden away after a click, the sliding mechanism is paused for a duration of pauseDuration milliseconds to avoid interference with scrolling. 
            *  @param {String} [settings.slideIn] - Provide a CSS class name to be applied to the header whenever the header is sliding into the page (which is the case when the user is scrolling up). The class will only be applied as long as the user is able to scroll up. Once the top of the page is reached, the class will be removed from the header. The header will have the CSS class <code>is-dynamic</code> when activated.
            *  @param {Object} [settings.callback] - A callback function to be called whenever the header changes. The header is given as an argument into the callback.
             */
            init: function (settings = { headerId: 'header', delta: 100, fixed: false, hideOnClick: false, pauseDuration: 250, slideIn: 'slide-in', callback: undefined }) {
                if (!this.dheader) {
                    this.dheader = DynamicHeader;
                }
                this.dheader.init(settings);
            },
            /**
             * Revert all changes that have been made by DynamicHeader;
             */
            destroy: function () {
                if (this.dheader) {
                    this.dheader.destroy();
                }
            }
        }
    }
} catch (e) {
    //in non-node environment module is not defined and therefore
    //we will not export anything
}