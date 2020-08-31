/* Service Worker */
if (navigator.serviceWorker) {
    navigator
        .serviceWorker
        .register('/serviceworker.js')
        .catch(error => {
            console.error(error);
        });
    addEventListener("load", function() {
        if (navigator.serviceWorker.controller) {
            navigator
                .serviceWorker
                .controller
                .postMessage({ "command": "trimCache" });
        }
    });
}

/* Back to top */
function maintainBackToStartVisibility() {
    let backToStart = document.getElementById('back-to-start');
    if (backToStart) {
        let windowHeight = window.innerHeight;
        let documentHeight = document.body.clientHeight;

        if (windowHeight * 1.5 < documentHeight) {
            backToStart.style.display = '';
        } else {
            backToStart.style.display = 'none';
        }
    }
}

/* Page load time */
function displayLoadTime() {
    let loadTime = document.getElementById('load-time');
    if (!loadTime) {
        console.log('Could not find DOM element with id load-time to indicate the page load time');
        return;
    }

    let seconds = 0;
    //PerformanceNavigationTiming API
    let entries = performance.getEntriesByType("navigation")
    if (entries && entries.length) {
        duration = entries[0].loadEventStart;
    } else if (performance && performance.timing) {
        //this is a deprecated API, it´s only here for browsers that
        //do not support the above PerformanceNavigationTiming API
        duration = performance.timing.loadEventStart - performance.timing.navigationStart;
    }

    if (duration) {
        let seconds = (duration / 1000).toFixed(2);
        let templateString = loadTime.innerText;
        if (templateString) {
            templateString = templateString.replace('${seconds}', seconds);
        } else {
            templateString = `This page loaded in ${seconds} seconds`;
        }
        loadTime.innerHTML = templateString;
        loadTime.style.display = '';
    } else {
        loadTime.style.display = 'none';
    }
}

/* Copy button */
/* Code copied from https://wearefrankly.co and adjusted*/
/* Please also have a look at https://adamsilver.io/articles/the-trouble-with-mailto-email-links-and-what-to-do-instead/ */
function isHostMethod(object, method) {
    let objectMethod = object[method];
    let type = typeof objectMethod;
    return type == 'function' || type == 'object' && null !== objectMethod || type == 'unknown';
}

function isHostObjectProperty(object, property) {
    let objectProperty = object[property];
    return typeof objectProperty == 'object' || typeof objectProperty == 'function' && null !== objectProperty;
}

function copyMailAddress() {
    if (!isHostMethod(document.documentElement, 'addEventListener') || !isHostObjectProperty(window, 'navigator') || !isHostObjectProperty(navigator, 'clipboard') ||
        isHostMethod(navigator.clipboard, 'writeText') || !isHostMethod(document.documentElement, 'querySelectorAll')
    ) {
        let mailCopies = document.querySelectorAll('.email-copy');
        for (let mailCopy of mailCopies) {
            let address = mailCopy.getAttribute('address');
            if (address) {
                let copyButton = document.createElement('button');
                copyButton.type = "button";
                copyButton.className = "email-copy-button";
                copyButton.innerHTML = '<span class="email-copy-button-text">Copy</span> <span>email address</span>';
                copyButton.addEventListener('click', e => {
                    navigator.clipboard.writeText(address).then(function() {
                        copyButton.querySelector('.email-copy-button-text').innerHTML = "Copied";
                        window.setTimeout(() => {
                            copyButton.querySelector('.email-copy-button-text').innerHTML = "Copy";
                        }, 3000);
                    });
                }, false);
                mailCopy.appendChild(copyButton);
            }
        }
    }
}



addEventListener('load', event => maintainBackToStartVisibility());
addEventListener('scroll', event => maintainBackToStartVisibility());
addEventListener('resize', event => maintainBackToStartVisibility());

addEventListener('load', event => copyMailAddress());

addEventListener('load', event => displayLoadTime());