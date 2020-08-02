addEventListener('load', event => {
    let loadTime = document.getElementById('load-time');
    if (!loadTime) {
        console.log('Could not find DOM element with id load-time to indicate the page load time');
        return;
    }

    let duration = 0;
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
        loadTime.innerHTML = 'This page loaded in ' + (duration / 1000).toFixed(2) + ' seconds';
    }
});

if (navigator.serviceWorker) {
    navigator
        .serviceWorker
        .register('/serviceworker.js')
        .catch(error => {
            console.error(error);
        });
    addEventListener("load", function () {
        if (navigator.serviceWorker.controller) {
            navigator
                .serviceWorker
                .controller
                .postMessage({ "command": "trimCache" });
        }
    });
}

function s(user, domain, b) {
    if (user && domain) {
        if (b) {
            window.location.href = `mailto:${btoa(user)}@${btoa(domain)}`;
        } else {
            window.location.href = `mailto:${user}@${domain}`;
        }
    } else {
        console.error(`Cannot use mail address ${user}@${domain}`);
    }
}