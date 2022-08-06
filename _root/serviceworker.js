const CACHE_VERSION = 'v40'; //version is used to remove old caches

const SCRIPT = 'script';
const RUNTIME = 'runtime';
const CSSCACHE = 'css';
const IMAGE = 'image';
const FONT = 'font';
const JSONCACHE = 'json';
const SEARCH = 'search';
const CACHE_NAME = 'cache';

const SCRIPT_CACHE_NAME = `${SCRIPT}-${CACHE_NAME}-${CACHE_VERSION}`;
const FONT_CACHE_NAME = `${FONT}-${CACHE_NAME}-${CACHE_VERSION}`;
const IMAGE_CACHE_NAME = `${IMAGE}-${CACHE_NAME}-${CACHE_VERSION}`;
const CSS_CACHE_NAME = `${CSSCACHE}-${CACHE_NAME}-${CACHE_VERSION}-3`;
const JSON_CACHE_NAME = `${JSONCACHE}-${CACHE_NAME}-${CACHE_VERSION}`;
const SEARCH_CACHE_NAME = `${SEARCH}-${CACHE_NAME}-${CACHE_VERSION}`;
const RUNTIME_CACHE_NAME = `${RUNTIME}-${CACHE_NAME}-${CACHE_VERSION}`;
const CACHE_NAMES = [FONT_CACHE_NAME, SCRIPT_CACHE_NAME, IMAGE_CACHE_NAME, RUNTIME_CACHE_NAME, JSON_CACHE_NAME, SEARCH_CACHE_NAME];

const SERVE_HTML_CACHE_FIRST = false;
const CACHE_FIRST_FOR_EXPIRED = true;
const NO_REVALIDATE_WITHIN_MINUTES = 10;

//maxAgeMinutes < 0: do not use the cache
//maxAgeMinutes = 0: cache forever
//maxAgeMinutes > 0: cache for the amount of minutes

const CACHE_SETTINGS = {

    [SCRIPT_CACHE_NAME]: {
        maxAgeMinutes: 60 * 24 * 30 //expire scripts after 30 days
    },
    [FONT_CACHE_NAME]: {
        maxAgeMinutes: 60 * 24 * 300 //expire fonts after 300 days
    },
    [RUNTIME_CACHE_NAME]: {
        maxAgeMinutes: 60 * 24 //expire runtime entries after one day
    },
    [CSS_CACHE_NAME]: {
        maxAgeMinutes: 60 * 24 //expire css after one day
    },
    [JSON_CACHE_NAME]: {
        maxAgeMinutes: 60 * 24 //expire json after one day
    },
    [SEARCH_CACHE_NAME]: {
        maxAgeMinutes: 60 * 24 //expire search after one day
    },
    [IMAGE_CACHE_NAME]: {
        maxAgeMinutes: 60 * 24 * 10, //expire images after 10 days
        maxItems: 100 //cache this amount of images, not more
    }
}

//!!!! if you change the url, change it also in the URLS_TO_IGNORE in the offline page !!!!
const OFFLINE_URL = '/offline/';

const NO_CACHE_URLS = [
    '/feed.xml/',
    '/feed.xml',
    '/rss.xml/',
    '/rss.xml'
]

const PRE_CACHE_URLS = [
    OFFLINE_URL,
    '/',
    '/css/main.css',
    '/js/site-scripts.js',
    '/js/lunr.js'
];


//preCache on install
addEventListener('install', async event => {
    await event.waitUntil(preCache())
    await skipWaiting(); //ensure that updates to the underlying 
    //service worker take effect immediately 
});


//remove old static caches on activate  
addEventListener('activate', async event => {
    const activate = async function() {
        await clearOldCaches();
        await clients.claim(); //let this service worker set itself 
        //as the controller for all clients within its scope        
        //use clients.claim() inside to 
        //the "activate" event listener 
        //so that clients do not need to be reloaded 
        //before their fetches will go through this service worker
    }
    await event.waitUntil(activate());
});


//the trimCache command must be sent from the onload event of 
//the page where the service worker is registered
//https://medium.com/@brandonrozek/limiting-the-cache-in-service-workers-revisited-f0245713e67e
addEventListener("message", event => {
    var data = event.data;
    if (data.command == "trimCache") {
        for (let cacheName of CACHE_NAMES) {
            if (CACHE_SETTINGS[cacheName]) {
                const maxItems = CACHE_SETTINGS[cacheName].maxItems;
                if (maxItems) {
                    log(`Trimming ${cacheName} to a max limit of ${maxItems} items`);
                    trimCache({ cacheName: cacheName, maxItems: maxItems });
                }
            }
        }
    }
});


//react on requests
addEventListener('fetch', event => {
    const request = event.request;

    const handleEvent = async function() {
        if (isHtmlRequest(request)) {
            if (SERVE_HTML_CACHE_FIRST) {
                return cacheFirst(event, { revalidate: true });
            } else {
                let networkFirstResponse = await networkFirst(event);
                if (networkFirstResponse) {
                    return networkFirstResponse;
                }
            }
        }
        //everyhting that´s not an html page
        //will be served cache first
        return cacheFirst(event);
    }

    log('Requesting ' + request.url);
    event.respondWith(handleEvent());
});


//// helpers 

function isHtmlRequest(request) {
    let url = new URL(request.url);
    let accept = request.headers.get('Accept');
    return accept && accept.includes('text/html') || /^\/.+\/$/.test(url.pathname);
}

async function preCache() {
    for (let url of PRE_CACHE_URLS) {
        try {
            await fetchAndCache(makeURL(url));
        } catch (err) {
            errorlog(`Failure when caching ${url}:` + err);
        }
    }
}


async function clearOldCaches() {
    return caches
        .keys()
        .then(cacheNames => cacheNames.filter(name => CACHE_NAMES.indexOf(name) == -1))
        .then(cacheNames => Promise.all(cacheNames.map(name => caches.delete(name))));
}


async function networkFirst(event) {
    const request = event.request;

    return fetchAndCache(request)
        .catch(error => errorlog('Failure in network first operation: ' + error));
}


async function cacheFirst(event, options) {

    options = options ? options : {};
    const request = event.request;
    const responseFromCache = await caches.match(request, options);

    if (responseFromCache && (CACHE_FIRST_FOR_EXPIRED || !isExpired(responseFromCache))) {
        log(`Responding from cache ${request.url}`);

        if ((isExpired(responseFromCache) || options.revalidate) && isAllowRevalidate(responseFromCache, request.url)) {
            //clone response and call without await
            options.responseFromCache = responseFromCache.clone();
            fetchAndCache(request, options)
                .catch(error => errorlog('Failure in cache first operation: ' + error));
        }

        return responseFromCache;
    } else {
        return fetchAndCache(request, options)
            .catch(error => {
                errorlog('Failure in cache first operation: ' + error);
                if (responseFromCache) {
                    //use an outdated cache response, 
                    //because that is better than nothing
                    return responseFromCache;
                } else {
                    return caches.match(OFFLINE_URL);
                }
            });;
    }
}


async function fetchAndCache(request, options) {
    options = options ? options : {};
    if (options.responseFromCache &&
        getExpireTimestamp(options.responseFromCache) > 0 &&
        !isExpired(options.responseFromCache) &&
        !options.revalidate) {
        //we have a cache entry that´s not expired
        //and we do not enforce a revalidation
        //no need to bother the network        
        return options.responseFromCache;
    }

    if (typeof request == 'string' ||
        request instanceof String ||
        request instanceof URL) {
        request = new Request(request);
    }

    let url = new URL(request.url);

    if (options.responseFromCache) {
        //we have a cache entry, but it´s expired 
        //or we have no expiration date for the entry
        //or we enforce a revalidation
        //therefore we have to update from the network
        log(`Revalidating cache ${url}`);
    } else {
        //we have no cache and therefore have
        //to fetch a response from the network
        log(`Responding from network ${url}`);
    }  for (let n of NO_CACHE_URLS) {
        if (n instanceof RegExp) {
            if (n.test(url.pathname)) {
                log(`Refusing to cache because of NO_CACHE_URL: ${request.url}`);
                return false;
            }
        } else if (n == url.pathname) {
            log(`Refusing to cache because of NO_CACHE_URL: ${request.url}`);
            return false;
        }
    }
    return fetch(request)
        .then(async responseFromNetwork => {

            if (isHtmlRequest(request)) {
                await stashInCache({
                    cacheName: RUNTIME_CACHE_NAME,
                    request: request,
                    response: responseFromNetwork.clone(),
                    options
                });
            } else if (/\/.*index.*\.json$/i.test(url.pathname)) {
                await stashInCache({
                    cacheName: SEARCH_CACHE_NAME,
                    request: request,
                    response: responseFromNetwork.clone(),
                    options
                });
            } else if (/\/.*\.(json|[web]manifest)$/i.test(url.pathname)) {
                await stashInCache({
                    cacheName: JSON_CACHE_NAME,
                    request: request,
                    response: responseFromNetwork.clone(),
                    options,
                });
            } else if (/\.js$/i.test(url.pathname)) {
                await stashInCache({
                    cacheName: SCRIPT_CACHE_NAME,
                    request: request,
                    response: responseFromNetwork.clone(),
                    options
                });
            } else if (/\.css[2]?$/i.test(url.pathname)) {
                await stashInCache({
                    cacheName: CSS_CACHE_NAME,
                    request: request,
                    response: responseFromNetwork.clone(),
                    options
                });
            } else if (/\.(woff[2]?|ttf|otf|sfnt)$/i.test(url.pathname)) {
                await stashInCache({
                    cacheName: FONT_CACHE_NAME,
                    request: request,
                    response: responseFromNetwork.clone(),
                    options
                });
            } else if (/\.(jpg|jpeg|webp|ico|png|gif|svg)$/i.test(url.pathname)) {
                await stashInCache({
                    cacheName: IMAGE_CACHE_NAME,
                    request: request,
                    response: responseFromNetwork.clone(),
                    options
                });
            }

            return responseFromNetwork;
        });
}

function log(message) {
    console.log(message);
}

function errorlog(message) {
    console.error(message);
}

//ensure to get a nice URL
function makeURL(url) {
    if ((typeof url == 'string' || url instanceof String) && !url.startsWith('http')) {
        return new URL(url, location.origin);
    }
    return new URL(url);

}

//extract the expiration timestamp
//from our self-invented `${CACHE_NAME}-expires` header
function getExpireTimestamp(response) {
    const expires = response.headers.get(`${CACHE_NAME}-expires`);
    return expires ? Date.parse(expires) : 0;
}

//extract the timestamp from the 
//http date header
function getDateTimestamp(response) {
    const date = response.headers.get('date');
    return date ? Date.parse(date) : 0;
}

async function maintainExpiration({ response, maxAgeMinutes }) {

    cloneHeaders = function(response) {
        let headers = new Headers();
        for (var kv of response.headers.entries()) {
            headers.append(kv[0], kv[1]);
        }
        return headers;
    }

    cloneResponse = async function(response) {
        try {
            let headers = cloneHeaders(response);

            let expires = new Date();
            expires.setMinutes(expires.getMinutes() + maxAgeMinutes);
            headers.append(`${CACHE_NAME}-expires`, expires.toUTCString());

            let blob = await response.blob();
            return new Response(blob, {
                status: response.status,
                statusText: response.statusText,
                headers: headers ? headers : response.headers
            });
        } catch (error) {
            errorlog((response ? response.url + ' status ' + response.status + ': ' : '') + error);
            return response;
        }
    }

    if (maxAgeMinutes > 0 && !response.type.includes('opaque') && response.type != 'error') {
        //unfortunately, for opaque response types 
        //the expiration cannot be controlled here        
        return cloneResponse(response);
    } else {
        return response;
    }
}

//https://medium.com/@adactio/cache-limiting-in-service-workers-d6741361ca19
async function trimCache({ cacheName, maxItems }) {
    try {
        let cache = await caches.open(cacheName);
        let keys = await cache.keys();
        if (keys.length > maxItems) {
            await cache.delete(keys[0]);
            await trimCache({ cacheName: cacheName, maxItems: maxItems });
        }
    } catch (error) {
        errorlog(error);
    }
}

function isPreCacheUrl({ request, response }) {
    let url = new URL(request.url);
 
    for (let p of PRE_CACHE_URLS) {
        if (p instanceof RegExp) {
            if (p.test(url.pathname + url.search)) {
                log(`Pre-caching: ${request.url}`);
                return true;
            }
        } else if (p == url.pathname + url.search) {
            log(`Pre-caching: ${request.url}`);
            return true;
        }
    }
    return false;
}
 
function isValidToCache({ request, response, cacheName, options }) {
    if (isPreCacheUrl({ request: request, response: response })) {
        //pre cache urls are always valid to cahce
        return true;
    }
 
    if (!options.maxAgeMinutes && CACHE_SETTINGS[cacheName]) {
        options.maxAgeMinutes = CACHE_SETTINGS[cacheName].maxAgeMinutes;
    }
 
    if (options.maxAgeMinutes < 0) {
        log(`Refusing to cache because ${cacheName} has maxAgeMinutes is negative: ${request.url}`)
        return false;
    }
 

    const url = new URL(request.url);
    for (let n of NO_CACHE_URLS) {
        if (n instanceof RegExp) {
            if (n.test(url.pathname + url.search)) {
                log(`Refusing to cache because of NO_CACHE_URL: ${request.url}`);
 
                return false;
            }
        } else if (n == url.pathname + url.search) {
            log(`Refusing to cache because of NO_CACHE_URL: ${request.url}`);
            return false;
        }
    }
    if (NO_CACHE_URLS.includes(url.pathname)) {
        log(`Refusing to cache because of NO_CACHE_URL: ${request.url}`);
        return false;
    }
    if (/^\/browser-sync\//.test(url.pathname)) {
        log(`Refusing to cache because of browser-sync request: ${request.url}`);
        return false;
    }
    if (request.method == 'POST') {
        log(`Refusing to cache because of POST request: ${request.url}`);
        return false;
    }
    if (request.method == 'PUT') {
        log(`Refusing to cache because of PUT request: ${request.url}`);
        return false;
    }
    if (response.type == 'error') {
        log(`Refusing to cache because of error response: ${request.url}`);
        return false;
    }
    if (response.type == 'opaque') {
        log(`Refusing to cache because of opaque response: ${request.url}`);
        return false;
    }
    return true;
}
 
//put the response into the cache
//if it is valid to cache
async function stashInCache({ request, response, cacheName, options }) {
    options = options ? options : {};
    try {
        if (isValidToCache({ request: request, response: response, cacheName: cacheName, options: options })) {
            let metaResponse = await maintainExpiration({ response: response, maxAgeMinutes: options.maxAgeMinutes })
            let cache = await caches.open(cacheName);
            log(`Putting into ${cacheName}: ${request.url}`);
            return cache.put(request, metaResponse);
        }
    } catch (error) {
        errorlog(error);
    }
}


//is the cache entry expired according
//to this response expiration settings?
function isExpired(response) {
    const expires = getExpireTimestamp(response);

    if (expires > 0) {
        const now = new Date();
        if (expires < now) {
            return true; //response is expired
        }
    }
    return false;
}

//only revalidate if the last cache update
//is more than NO_REVALIDATE_WITHIN_MINUTES ago
function isAllowRevalidate(response, url) {
    let date = getDateTimestamp(response);

    if (date > 0) {
        date += NO_REVALIDATE_WITHIN_MINUTES * 1000 * 60;
        const now = new Date();
        if (date < now) {
            return true;
        } else {
            log(`Not revalidating ${url} because it has been cached within the last ${NO_REVALIDATE_WITHIN_MINUTES} minutes`);
            return false;
        }
    }
    return true;
}