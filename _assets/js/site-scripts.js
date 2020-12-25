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
        return;
    }

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


addEventListener('load', event => maintainBackToStartVisibility());
addEventListener('scroll', event => maintainBackToStartVisibility());
addEventListener('resize', event => maintainBackToStartVisibility());

addEventListener('load', event => displayLoadTime());