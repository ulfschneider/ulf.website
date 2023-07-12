

const CACHE_NAME = '{{trimBase}}' ? '{{trimBase}}-cache' : 'cache';

//the following caches will get ignored. if the value is defined, it must be a regular expression
//if the value is undefined, the cache will be completely cleared except of the cache names that
//are under control of this service worker
//const IGNORE_CACHE_PATTERN = new RegExp(`^(?!${CACHE_NAME}).*`); //do not take control of what does not start with our cache name

IGNORE_CACHE_PATTERN = undefined; //do not ignore anything - take control of all caches

const OFFLINE_URL = '{{offline}}' ? '{{offline}}' : '/offline/';

const NO_CACHE_URLS = [
  '/feed.xml/',
  '/feed.xml',
  '/rss.xml/',
  '/rss.xml'
]

if ('{{trimBase}}') {
  NO_CACHE_URLS.push(/^(?!\/{{trimBase}}\/).*/);
}


const PRE_CACHE_URLS = [
  OFFLINE_URL,
  '/',
  '/css/main-{{cssVersion}}.css'
];


const SCRIPT_CACHE_NAME = `${CACHE_NAME}-script-{{scriptVersion}}`;
const RUNTIME_CACHE_NAME = `${CACHE_NAME}-runtime-{{runtimeVersion}}`;
const CSS_CACHE_NAME = `${CACHE_NAME}-css-{{cssVersion}}`;
const IMAGE_CACHE_NAME = `${CACHE_NAME}-image-{{imageVersion}}`;
const FONT_CACHE_NAME = `${CACHE_NAME}-font-{{fontVersion}}`;
const JSON_CACHE_NAME = `${CACHE_NAME}-json-{{jsonVersion}}`;
const SEARCH_CACHE_NAME = `${CACHE_NAME}-search-{{searchVersion}}`;

const CACHE_NAMES = [SCRIPT_CACHE_NAME, RUNTIME_CACHE_NAME, CSS_CACHE_NAME, IMAGE_CACHE_NAME, FONT_CACHE_NAME, JSON_CACHE_NAME, SEARCH_CACHE_NAME];

const CACHE_FIRST_FOR_EXPIRED = false;
const NO_REVALIDATE_WITHIN_MINUTES = 10;

//maxAgeMinutes < 0: do not use the cache
//maxAgeMinutes = 0: cache forever
//maxAgeMinutes > 0: cache for the amount of minutes

const CACHE_SETTINGS = {

  [SCRIPT_CACHE_NAME]: {
    maxAgeMinutes: 60 * 24 * 30, //expire scripts after 30 days
    //serveCacheFirst: true is default
  },
  [FONT_CACHE_NAME]: {
    maxAgeMinutes: 60 * 24 * 300, //expire fonts after 300 days
    //serveCacheFirst: true is default
  },
  [RUNTIME_CACHE_NAME]: {
    maxAgeMinutes: 60 * 24, //expire runtime entries after one day
    //serveNetworkFirst: true is default
  },
  [CSS_CACHE_NAME]: {
    maxAgeMinutes: 60 * 24, //expire css after one day
    //serveCacheFirst: true is default
  },
  [JSON_CACHE_NAME]: {
    maxAgeMinutes: 60 * 24 //expire json after one day
    //serveCacheFirst: true is default
  },
  [SEARCH_CACHE_NAME]: {
    maxAgeMinutes: 60 * 24, //expire search after one day
    serveNetworkFirst: true //false would be the default
  },
  [IMAGE_CACHE_NAME]: {
    maxAgeMinutes: 60 * 24 * 10, //expire images after 10 days
    maxItems: 100 //cache this amount of images, not more
    //serveCacheFirst: true is default
  }
}


//// helpers

function isNetworkFirst(cacheName) {
  let cache = CACHE_SETTINGS[cacheName];
  if (cacheName == RUNTIME_CACHE_NAME) {
    //the runtime cache default is network first if nothing is configured
    if (cache && cache.serveCacheFirst) {
      return false;
    } else if (cache && cache.serveNetworkFirst === false) {
      return false;
    } else {
      return true;
    }
  } else {
    //all other caches are cache first if nothing is configured
    if (cache && cache.serveCacheFirst === false) {
      return true;
    } else if (cache && cache.serveNetworkFirst) {
      return true;
    } else {
      return false;
    }
  }
}

function isHtmlRequest(request) {
  let accept = request.headers.get('Accept');
  return accept && accept.includes('text/html');
}

//preCache on install
addEventListener('install', async event => {
  //ensure that updates to the underlying
  //service worker take effect immediately
  //https://bitsofco.de/what-self-skipwaiting-does-to-the-service-worker-lifecycle/
  await self.skipWaiting();

  await event.waitUntil(preCache());
});


//remove old static caches on activate
addEventListener('activate', async event => {
  const activate = async function () {
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
  const cacheName = getCacheNameForRequest(request);

  const handleEvent = async function () {
    if (isNetworkFirst(cacheName)) {
      let networkFirstResponse = await networkFirst(event);
      if (networkFirstResponse) {
        return networkFirstResponse;
      }
    }
    //from here on it´s cache first
    if (isHtmlRequest(request)) {
      return cacheFirst(event, { revalidate: true });
    } else {
      return cacheFirst(event);
    }
  }

  log('Requesting ' + request.url);
  event.respondWith(handleEvent());
});


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
    .then(cacheNames => cacheNames.filter(name => {
      if (IGNORE_CACHE_PATTERN && IGNORE_CACHE_PATTERN.test(name)) {
        //if the given cache name contains the ignore pattern, well, ignore it
        log(`Ignoring cache ${name}`);
        return false;
      }
      //if the cache name is not part of the cache names of this service worker, delete the cache
      if (CACHE_NAMES.indexOf(name) == -1) {
        log(`Clearing cache ${name}`);
        return true;
      }
    }))
    .then(cacheNames => Promise.all(cacheNames.map(name => caches.delete(name))));
}


async function networkFirst(event) {
  const request = event.request;

  return fetchAndCache(request)
    .catch(error => log('Failure in network first operation: ' + error));
}


async function cacheFirst(event, options) {
  const request = event.request;
  const cacheName = getCacheNameForRequest(request);
  options = options ? options : {};
  options.cacheName = cacheName;
  let responseFromCache;
  if (cacheName) {
    responseFromCache = await caches.match(request, options);
  }

  if (responseFromCache && (CACHE_FIRST_FOR_EXPIRED || !isExpired(responseFromCache))) {
    log(`Responding from ${cacheName} ${request.url}`);

    if ((isExpired(responseFromCache) || options.revalidate) && isAllowRevalidate(responseFromCache, request.url)) {
      //clone response and call without await
      options.responseFromCache = responseFromCache.clone();
      fetchAndCache(request, options)
        .catch(error => log('Could not refresh expired cache: ' + error));
    }

    return responseFromCache;
  } else {
    return fetchAndCache(request, options)
      .catch(error => {
        if (responseFromCache) {
          log('Returning expired cache because network operation was not successful');
          //use an outdated cache response,
          //because that is better than nothing
          return responseFromCache;
        } else {
          return caches.match(OFFLINE_URL);
        }
      });
  }
}

function getCacheNameForRequest(request) {
  let url = new URL(request.url);
  if (isHtmlRequest(request)) {
    return RUNTIME_CACHE_NAME;
  } else if (/\/api\/search.*/i.test(url.pathname)) {
    return SEARCH_CACHE_NAME;
  } else if (/\/.*\.(json|(web)?manifest)$/i.test(url.pathname)) {
    return JSON_CACHE_NAME;
  } else if (/\.js$/i.test(url.pathname)) {
    return SCRIPT_CACHE_NAME;
  } else if (/\.css(2)?$/i.test(url.pathname)) {
    return CSS_CACHE_NAME;
  } else if (/\.(woff(2)?|ttf|otf|sfnt)$/i.test(url.pathname)) {
    return FONT_CACHE_NAME;
  } else if (/\.(jpg|jpeg|webp|ico|png|gif|svg)$/i.test(url.pathname)) {
    return IMAGE_CACHE_NAME;
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
  }
  return fetch(request)
    .then(async responseFromNetwork => {
      let cacheName = getCacheNameForRequest(request);
      if (cacheName) {
        await stashInCache({
          cacheName: cacheName,
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

function warnlog(message) {
  console.warn(message);
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
//from our self-invented `cache-expires` header
function getExpireTimestamp(response) {
  const expires = response.headers.get('cache-expires');
  return expires ? Date.parse(expires) : 0;
}

//extract the timestamp from the
//http date header
function getDateTimestamp(response) {
  const date = response.headers.get('date');
  return date ? Date.parse(date) : 0;
}

async function maintainExpiration({ response, maxAgeMinutes }) {

  cloneHeaders = function (response) {
    let headers = new Headers();
    for (var kv of response.headers.entries()) {
      headers.append(kv[0], kv[1]);
    }
    return headers;
  }

  cloneResponse = async function (response) {
    try {
      let headers = cloneHeaders(response);

      let expires = new Date();
      expires.setMinutes(expires.getMinutes() + maxAgeMinutes);
      headers.append('cache-expires', expires.toUTCString());

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
        log(`Pre-caching: ${url}`);
        return true;
      }
    } else if (p == url.pathname + url.search) {
      log(`Pre-caching: ${url}`);
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
    log(`Refusing to cache because ${cacheName} maxAgeMinutes is negative: ${request.url}`)
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
