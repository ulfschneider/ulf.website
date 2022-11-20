/**
  *
 * Make your table of contents (toc) active.
 * 
 * Please visit <a href="https://ulfschneider.io/tools/active-toc/">ulfschneider.io/tools/active-toc</a> to see ActiveToc in action or 
 * download the <a href="https://github.com/ulfschneider/active-toc">GitHub repo</a> and open the file <code>index.html</code> to see the usage.
 * 
 * Embed the script <code>active-toc.min.js</code> in your web page.
 * 
 * <pre><code>
 * &lt;script src="active-toc.min.js">&lt;/script>
 * </code></pre> 
 * 
 * ActiveToc is using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API">IntersectionObserver API</a>.
 */
ActiveToc = (function () {

    let config, links = [], headings = [], observer, tocContainer;

    function transferConfig(settings) {
        if (typeof settings == 'string' || settings instanceof String) {
            //the provided settings object is a string and therefore assumed to 
            //be the selector for the container
            return {
                tocContainer: settings
            }
        }

        let config = Object.assign({}, settings);
        if (!config.tocContainer) {
            config.tocContainer = '#header';
        }

        return config;
    }

    function init(settings) {
        let containerSelector;
        config = transferConfig(settings);

        if (typeof config.tocContainer == 'string' || config.tocContainer instanceof String) {
            containerSelector = config.tocContainer;
        } else if (config.tocContainer) {
            tocContainer = config.tocContainer;
        } else {
            containerSelector = 'header';
        }

        if (document.querySelector && window.IntersectionObserver) {
            if (containerSelector) {
                tocContainer = document.querySelector(containerSelector);

                if (!tocContainer) {
                    console.log('A toc container with selector=[' + containerSelector + '] could not be found in the document');
                    if (settings.headless) {
                        console.log('Working in headless mode');
                        headings = [...document.querySelectorAll('h2, h3, h4, h5, h6')];
                    }
                } else {
                    links = [...tocContainer.querySelectorAll('a')];
                    links.forEach(link => {
                        let id = link.getAttribute('href');
                        if (id && id.startsWith('#')) {
                            try {
                                headings.push(document.querySelector(id));
                            } catch (e) {
                                console.warn('Heading with id=[' + id + '] not found in document');
                            }
                        }
                    });
                }
            }

            observer = new IntersectionObserver(handleObserver, config.intersectionOptions);
            headings.forEach(heading => {
                if (heading) {
                    observer.observe(heading);
                }
            });
        } else {
            console.error('ActiveToc cannot run on this device because the Intersection Observer API is not supported');
        }
    }

    function unobserve() {
        headings.forEach(heading => {
            observer.unobserve(heading);
            heading.classList.remove('h-is-visible');
            heading.classList.remove('h-is-active');
            heading.classList.remove('h-is-highlight');
        });
    }

    function destroy() {
        unobserve();
        links.forEach(link => {
            link.classList.remove('is-visible');
            link.classList.remove('is-active');
            link.classList.remove('is-highlight');
        });
    }

    function handleObserver(entries, observer) {
        entries.forEach(entry => {
            indicateVisible(entry);
            indicateActive(entry);
            indicateHighlight(entry);
        });
    }

    function getAssociatedTocLinks(id) {
        if (tocContainer) {
            return tocContainer.querySelectorAll(
                `a[href="#${id}"]`
            );
        } else {
            return [];
        }
    }

    function indicateVisible(entry) {
        headings.forEach(heading => {
            let links = getAssociatedTocLinks(heading.id);

            heading.classList.remove('h-is-highlight');
            heading.classList.remove('h-is-active');

            links.forEach(link => {
                link.classList.remove('is-highlight');
                link.classList.remove('is-active');
            });

            if (heading.id == entry.target.id) {
                if (entry.isIntersecting) {
                    heading.classList.add('h-is-visible')
                    links.forEach(link => {
                        link.classList.add('is-visible');
                        if (config.onVisible) {
                            config.onVisible(link, heading);
                        }
                    });
                    if (!tocContainer && config.onVisible) {
                        config.onVisible(null, heading);
                    }
                } else {
                    heading.classList.remove('h-is-visible');
                    links.forEach(link => {
                        link.classList.remove('is-visible');
                    });
                }
            }
        });
    }

    function indicateActive(entry) {
        for (let i = headings.length - 1; i >= 0; i--) {
            if (headings[i].offsetTop <= window.pageYOffset) {
                let links = getAssociatedTocLinks(headings[i].id);
                headings[i].classList.add('h-is-active');
                links.forEach(link => {
                    link.classList.add('is-active');
                    if (config.onActive) {
                        config.onActive(link, headings[i]);
                    }
                });
                if (!tocContainer && config.onActive) {
                    config.onActive(null, headings[i]);
                }

                break;
            }
        }
    }

    function indicateHighlight(entry) {
        let firstMatch;

        headings.forEach(heading => {
            let links = getAssociatedTocLinks(heading.id);

            //check if there are visible headings
            //and highlight the first one 
            if (heading.classList.contains('h-is-visible')) {

                if (!firstMatch) {
                    firstMatch = heading.id;
                    heading.classList.add('h-is-highlight');
                    for (let link of links) {
                        link.classList.add('is-highlight');
                        if (config.onHighlight) {
                            config.onHighlight(link, heading);
                        }
                    }
                    if (!tocContainer && config.onHighlight) {
                        config.onHighlight(null, heading);
                    }
                }

            }
        });


        if (!firstMatch) {
            //no visible heading exists 
            //mark all actives to be highlighted
            let hasHighlight = false;
            headings.forEach(heading => {
                if (heading.classList.contains('h-is-active')) {
                    hasHighlight = true;
                    heading.classList.add('h-is-highlight');
                    let links = getAssociatedTocLinks(heading.id);
                    for (let link of links) {
                        link.classList.add('is-highlight');
                        if (config.onHighlight) {
                            config.onHighlight(link, heading);
                        }
                    }
                    if (!tocContainer && config.onHighlight) {
                        config.onHighlight(null, heading);
                    }
                }
            });

            if (!hasHighlight && config.offHighlight) {
                config.offHighlight();
            }
        }

    }

    //public API
    return {
        init: function (settings) {
            init(settings);
        },
        unobserve: function () {
            unobserve();
        },
        destroy: function () {
            destroy();
        }
    }
})();

//////// Module Interface

try {
    if (module) {
        module.exports = {
            /**  
            * Without defining the toc container a call like <code>ActiveToc.init()</code> will search for an element
            * with <code>id="header"</code> or a <code>header</code> tag and will make that element the container for the active toc.
            * The container has to hold a set of links to headings (h2, h3, h4, h5, h6) inside of the document. Each heading needs to be identified with the id attribute.
            * When scrolling contents or resizing the window, the links in the tocContainer will be assigned a combination of the CSS classes  
            * <ul>
            * <li><code>is-visible</code> if the associated heading of the link is visible</li>
            * <li><code>is-active</code> if the heading is not visible, but still can be considered active</li>
            * <li><code>is-highlight</code> as the single one that´s suggested to be highlighted (to avoid highlighting multiple entries)</li>
            * </ul>
            * In addition, the headings themself also get CSS classes assigned:
            * <ul>
            * <li><code>h-is-visible</code> if the heading visible</li>
            * <li><code>h-is-active</code> if the heading is not visible, but still can be considered active</li>
            * <li><code>h-is-highlight</code> as the single heading that´s suggested to be highlighted (to avoid highlighting multiple entries)</li>
            * </ul>
            * If no tocContainer can be found, the headings of the document will only be processed if <code>settings.headless</code> is <code>true</code>, otherwise the headings will be ignored.
            * If <code>settings.headless</code> is true, the headings alone will be analyzed and the <code>h-is-visible</code>, <code>h-is-active</code>, <code>h-is-highlight</code> classes will be assigned as appropriate to the headings.
            * @param {(string|Object)} [settings] – Optional: Can be empty, a String, or a settings object. A String will be interpreted as a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors">selector</a> for the toc container. A settings object must contain a tocContainer property that will store the selector for the toc container.
            * @param {string} [settings.tocContainer] - Optional: Specify the selector of the container that holds the links to the headings inside of your document. Default id is <code>#header</code>. If not specified the first html <code>header</code> tag will be used.
            * @param {boolean} [settings.headless=false] - Optional: If true, headings are processed without an associated tocContainer
            * @param {IntersectionOptions} [settings.intersectionOptions] - Optional: The Intersection observer options as defined by the intersection observer API
            * @param {function(Object, Object)} [settings.onVisible] - Optional: A function that will be called when an element receives visible status. The toc entry that received visible status (null if the entry doesn´t exist) and the associated heading will be passed as arguments into the function. 
            * @param {function(Object, Object)} [settings.onActive] - Optional: A function that will be called when an element receives active status. The toc entry that received active status (null if the entry doesn´t exist) and the associated heading will be passed as arguments into the function. 
            * @param {function(Object, Object)} [settings.onHighlight] - Optional: A function that will be called when an element receives highlight status. The toc entry that received visible status (null if the entry doesn´t exit) and the associated heading will be passed as arguments into the function. 
            * @param {function()} [settings.offHighlight] - Optional: A function that will be called when a highlighted element looses the highlight status and no new highlighted element is available. 
            */
            init: function (settings) {
                if (!this.activeToc) {
                    this.activeToc = ActiveToc;
                }
                this.activeToc.init(settings);
            },
            /**
             * Revert all changes that have been made by ActiveToc
             */
            destroy: function () {
                if (this.activeToc) {
                    this.activeToc.destroy();
                }
            },
            /**
             * Do no longer observe the headings of the document
             */
            unobserve: function () {
                if (this.activeToc) {
                    this.activeToc.unobserve();
                }
            }
        }
    }
} catch (e) {
    console.log('Using ActiveToc in non-module environment');
}
