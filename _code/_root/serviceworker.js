//this will be processed during the build
let site = {}

const IGNORE_CACHE_PATTERN = site.cache?.ignoreCacheRegex || ""

const CACHE_NAME = site.cache?.name || ""

const OFFLINE_URL = site.cache?.offlineUrl || "/offline/"

const NO_CACHE_URLS = site.cache?.noCacheUrls || []

const PRE_CACHE_URLS = site.cache?.preCacheUrls || []

const CACHE_VERSION = site.buildTimestamp || ""

function makeCacheName(cacheType) {
  let name = ""
  if (CACHE_NAME) {
    name = CACHE_NAME + "-"
  }
  name += cacheType
  name += CACHE_VERSION
  return name
}

const SCRIPT_CACHE_NAME = makeCacheName("script")
const HTML_CACHE_NAME = makeCacheName("html")
const CSS_CACHE_NAME = makeCacheName("css")
const IMAGE_CACHE_NAME = makeCacheName("image")
const FONT_CACHE_NAME = makeCacheName("font")
const JSON_CACHE_NAME = makeCacheName("json")

const CACHE_NAMES = [
  SCRIPT_CACHE_NAME,
  HTML_CACHE_NAME,
  CSS_CACHE_NAME,
  IMAGE_CACHE_NAME,
  FONT_CACHE_NAME,
  JSON_CACHE_NAME
]

const CACHE_FIRST_FOR_EXPIRED = false
const NO_REVALIDATE_WITHIN_MINUTES = 5

//maxAgeMinutes < 0: do not use the cache
//maxAgeMinutes = 0: cache forever
//maxAgeMinutes > 0: cache for the amount of minutes

const CACHE_SETTINGS = {
  [SCRIPT_CACHE_NAME]: {
    cacheName: SCRIPT_CACHE_NAME,
    maxAgeMinutes: 60 * 24 * 30, //expire scripts after 30 days
    serveCacheFirst: true, //true is default
    revalidate: true
  },
  [FONT_CACHE_NAME]: {
    cacheName: FONT_CACHE_NAME,
    maxAgeMinutes: 60 * 24 * 300, //expire fonts after 300 days
    serveCacheFirst: true, //true is default
    revalidate: false
  },
  [HTML_CACHE_NAME]: {
    cacheName: HTML_CACHE_NAME,
    maxAgeMinutes: 60 * 24 //expire html entries after one day
    //serveCacheFirst: no matter what is configured, it will always be treated as false! HTML must be network first!
  },
  [CSS_CACHE_NAME]: {
    cacheName: CSS_CACHE_NAME,
    maxAgeMinutes: 60 * 24, //expire css after one day
    serveCacheFirst: true, //true is default
    revalidate: true
  },
  [JSON_CACHE_NAME]: {
    cacheName: JSON_CACHE_NAME,
    maxAgeMinutes: 60 * 24, //expire json after one day
    serveCacheFirst: true, //true is default
    revalidate: false
  },
  [IMAGE_CACHE_NAME]: {
    cacheName: IMAGE_CACHE_NAME,
    maxAgeMinutes: 60 * 24 * 10, //expire images after 10 days
    maxItems: 100, //cache this amount of images, not more
    serveCacheFirst: true, //true is default
    revalidate: false
  }
}

//// helpers

function isNetworkFirst(cacheName) {
  let cacheSettings = CACHE_SETTINGS[cacheName]

  if (cacheName == HTML_CACHE_NAME) {
    return true
  } else if (cacheSettings?.serveCacheFirst === false) {
    return true
  } else if (cacheSettings?.serveNetworkFirst) {
    return true
  } else {
    return false
  }
}

function isHtmlRequest(request) {
  return request.destination === "document"
}

//service worker install event
addEventListener("install", (event) => {
  event.waitUntil(preCache())

  //Once successfully installed,
  //the updated worker will wait until the existing worker is controlling zero clients.
  //(Note that clients overlap during a refresh.)
  //skipWaiting() prevents the waiting,
  //meaning the service worker activates as soon as it's finished installing.
  skipWaiting()
})

//service worker activate event
addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([clearOldCaches(), clients.claim()]))
  //By default, a page's fetches won't go through a service worker
  //unless the page request itself went through a service worker.
  //So you'll need to refresh the page to see the effects of the service worker.
  //clients.claim() overrides this default, and take control of non-controlled pages.
})

addEventListener("message", (event) => {
  var data = event.data
  if (data.command == "trimCache") {
    //the trimCache command must be sent from the onload event of
    //the page where the service worker is registered
    //https://medium.com/@brandonrozek/limiting-the-cache-in-service-workers-revisited-f0245713e67e
    for (let cacheName of CACHE_NAMES) {
      if (CACHE_SETTINGS[cacheName]) {
        const maxItems = CACHE_SETTINGS[cacheName].maxItems
        if (maxItems) {
          log(`Trimming ${cacheName} to a max limit of ${maxItems} items`)
          trimCache({ cacheName: cacheName, maxItems: maxItems })
        }
      }
    }
  }
})

//react on requests
addEventListener("fetch", (event) => {
  const request = event.request
  const cacheName = getCacheNameForRequest(request)
  let cacheSettings = Object.assign({}, CACHE_SETTINGS[cacheName]) //clone

  const handleEvent = async function () {
    if (isNetworkFirst(cacheName) || isHtmlRequest(request)) {
      let networkFirstResponse = await networkFirst(event)
      if (networkFirstResponse) {
        return networkFirstResponse
      }
    } else {
      return cacheFirst(event, cacheSettings)
    }
  }

  log("Requesting " + request.url)
  event.respondWith(handleEvent())
})

async function preCache() {
  for (let url of PRE_CACHE_URLS) {
    try {
      await fetchAndCache(makeURL(url))
    } catch (err) {
      errorlog(`Failure when caching ${url}:` + err)
    }
  }
}

async function clearOldCaches() {
  return caches
    .keys()
    .then((cacheNames) =>
      cacheNames.filter((name) => {
        if (IGNORE_CACHE_PATTERN && IGNORE_CACHE_PATTERN.test(name)) {
          //if the given cache name contains the ignore pattern, well, ignore it
          log(`Ignoring cache ${name}`)
          return false
        }
        //if the cache name is not part of the cache names of this service worker, delete the cache
        if (CACHE_NAMES.indexOf(name) == -1) {
          log(`Clearing cache ${name}`)
          return true
        }
      })
    )
    .then((cacheNames) =>
      Promise.allSettled(cacheNames.map((name) => caches.delete(name)))
    )
}

async function networkFirst(event) {
  const request = event.request

  return fetchAndCache(request).catch((error) =>
    log("Failure in network first operation: " + error)
  )
}

async function cacheFirst(event, options) {
  const request = event.request

  let responseFromCache
  if (options.cacheName) {
    responseFromCache = await caches.match(request, options)
  }

  if (
    responseFromCache &&
    (CACHE_FIRST_FOR_EXPIRED || !isExpired(responseFromCache))
  ) {
    log(`Responding from ${options.cacheName} ${request.url}`)

    if (
      (isExpired(responseFromCache) || options.revalidate) &&
      isAllowRevalidate(responseFromCache, request.url)
    ) {
      //clone response and call without await
      options.responseFromCache = responseFromCache.clone()
      fetchAndCache(request, options).catch((error) =>
        log("Could not refresh expired cache: " + error)
      )
    }

    return responseFromCache
  } else {
    return fetchAndCache(request, options).catch((error) => {
      if (responseFromCache) {
        log(
          "Returning expired cache because network operation was not successful"
        )
        //use an outdated cache response,
        //because that is better than nothing
        return responseFromCache
      } else {
        return caches.match(OFFLINE_URL, options)
      }
    })
  }
}

function getCacheNameForRequest(request) {
  let url = new URL(request.url)
  if (isHtmlRequest(request)) {
    return HTML_CACHE_NAME
  } else if (/\/.*\.(json|(web)?manifest)$/i.test(url.pathname)) {
    return JSON_CACHE_NAME
  } else if (/\.(js|mjs)$/i.test(url.pathname)) {
    return SCRIPT_CACHE_NAME
  } else if (/\.css(2)?$/i.test(url.pathname)) {
    return CSS_CACHE_NAME
  } else if (/\.(woff(2)?|ttf|otf|sfnt)$/i.test(url.pathname)) {
    return FONT_CACHE_NAME
  } else if (/\.(jpg|jpeg|webp|ico|png|gif|svg)$/i.test(url.pathname)) {
    return IMAGE_CACHE_NAME
  }
}

async function fetchAndCache(request, options) {
  options = options ? options : {}
  if (
    options.responseFromCache &&
    isHtmlRequest(request) &&
    !isExpired(options.responseFromCache) &&
    !options.revalidate
  ) {
    //we have a cache entry that´s not expired
    //and we do not enforce a revalidation
    //no need to bother the network
    return options.responseFromCache
  }

  if (
    typeof request == "string" ||
    request instanceof String ||
    request instanceof URL
  ) {
    request = new Request(request)
  }

  let url = new URL(request.url)

  if (options.responseFromCache) {
    //we have a cache entry, but it´s expired
    //or we have no expiration date for the entry
    //or we enforce a revalidation
    //therefore we have to update from the network
    log(`Revalidating cache ${url}`)
  } else {
    //we have no cache and therefore have
    //to fetch a response from the network
    log(`Responding from network ${url}`)
  }
  return fetch(request).then(async (responseFromNetwork) => {
    let cacheName = getCacheNameForRequest(request)
    if (cacheName) {
      await stashInCache({
        cacheName: cacheName,
        request: request,
        response: responseFromNetwork.clone(),
        options
      })
    }
    return responseFromNetwork
  })
}

function log(message) {
  console.log(message)
}

function warnlog(message) {
  console.warn(message)
}

function errorlog(message) {
  console.error(message)
}

//ensure to get a nice URL
function makeURL(url) {
  if (
    (typeof url == "string" || url instanceof String) &&
    !url.startsWith("http")
  ) {
    return new URL(url, location.origin)
  }
  return new URL(url)
}

//extract the expiration timestamp
//from the self-invented `cache-expires` header
function getExpireTimestamp(response) {
  const expires = response?.headers?.get("cache-expires")
  return expires ? Date.parse(expires) : 0
}

//extract the timestamp from the
//http date header
function getDateTimestamp(response) {
  const date = response?.headers?.get("date")
  return date ? Date.parse(date) : 0
}

async function maintainExpiration({ response, maxAgeMinutes }) {
  cloneHeaders = function (response) {
    let headers = new Headers()
    for (var kv of response.headers.entries()) {
      headers.append(kv[0], kv[1])
    }
    return headers
  }

  cloneResponse = async function (response) {
    try {
      let headers = cloneHeaders(response)

      let expires = new Date()
      expires.setMinutes(expires.getMinutes() + maxAgeMinutes)
      headers.append("cache-expires", expires.toUTCString())

      let blob = await response.blob()
      return new Response(blob, {
        status: response.status,
        statusText: response.statusText,
        headers: headers ? headers : response.headers
      })
    } catch (error) {
      errorlog(
        (response ? response.url + " status " + response.status + ": " : "") +
          error
      )
      return response
    }
  }

  if (
    maxAgeMinutes > 0 &&
    !response.type.includes("opaque") &&
    response.type != "error"
  ) {
    //unfortunately, for opaque response types
    //the expiration cannot be controlled here
    return cloneResponse(response)
  } else {
    return response
  }
}

//https://medium.com/@adactio/cache-limiting-in-service-workers-d6741361ca19
async function trimCache({ cacheName, maxItems }) {
  try {
    let cache = await caches.open(cacheName)
    let keys = await cache.keys()
    if (keys.length > maxItems) {
      await cache.delete(keys[0])
      await trimCache({ cacheName: cacheName, maxItems: maxItems })
    }
  } catch (error) {
    errorlog(error)
  }
}

function hasMatchingUrl(urls, url) {
  for (let n of urls) {
    if (n instanceof RegExp) {
      if (n.test(url.pathname + url.search)) {
        return true
      }
    } else if (n == url.pathname + url.search) {
      return true
    }
  }
  if (urls.includes(url.pathname)) {
    return true
  }
}

function isPreCacheUrl({ request, response }) {
  let url = new URL(request.url)

  for (let p of PRE_CACHE_URLS) {
    if (p instanceof RegExp) {
      if (p.test(url.pathname + url.search)) {
        log(`Pre-caching: ${url}`)
        return true
      }
    } else if (p == url.pathname + url.search) {
      log(`Pre-caching: ${url}`)
      return true
    }
  }
  return false
}

function isValidToCache({ request, response, cacheName, options }) {
  if (isPreCacheUrl({ request: request, response: response })) {
    //pre cache urls are always valid to cahce
    return true
  }

  if (!options.maxAgeMinutes && CACHE_SETTINGS[cacheName]) {
    options.maxAgeMinutes = CACHE_SETTINGS[cacheName].maxAgeMinutes
  }

  if (options.maxAgeMinutes < 0) {
    log(
      `Refusing to cache because ${cacheName} maxAgeMinutes is negative: ${request.url}`
    )
    return false
  }

  const url = new URL(request.url)
  if (hasMatchingUrl(NO_CACHE_URLS, url)) {
    log(`Refusing to cache because of NO_CACHE_URL: ${request.url}`)
    return false
  }
  if (/^\/browser-sync\//.test(url.pathname)) {
    log(`Refusing to cache because of browser-sync request: ${request.url}`)
    return false
  }
  if (request.method == "POST") {
    log(`Refusing to cache because of POST request: ${request.url}`)
    return false
  }
  if (request.method == "PUT") {
    log(`Refusing to cache because of PUT request: ${request.url}`)
    return false
  }
  if (response.type == "error") {
    log(`Refusing to cache because of error response: ${request.url}`)
    return false
  }
  if (response.type == "opaque") {
    log(`Refusing to cache because of opaque response: ${request.url}`)
    return false
  }
  return true
}

//put the response into the cache
//if it is valid to cache
async function stashInCache({ request, response, cacheName, options }) {
  options = options ? options : {}
  try {
    if (
      isValidToCache({
        request: request,
        response: response,
        cacheName: cacheName,
        options: options
      })
    ) {
      let metaResponse = await maintainExpiration({
        response: response,
        maxAgeMinutes: options.maxAgeMinutes
      })
      let cache = await caches.open(cacheName)
      log(`Putting into ${cacheName}: ${request.url}`)
      return cache.put(request, metaResponse)
    }
  } catch (error) {
    errorlog(error)
  }
}

//is the cache entry expired according
//to this response expiration settings?
function isExpired(response) {
  const expires = getExpireTimestamp(response)

  if (expires > 0) {
    const now = new Date()
    if (expires < now) {
      return true //response is expired
    }
  }
  return false
}

//only revalidate if the last cache update
//is more than NO_REVALIDATE_WITHIN_MINUTES ago
function isAllowRevalidate(response, url) {
  let date = getDateTimestamp(response)

  if (date > 0) {
    date += NO_REVALIDATE_WITHIN_MINUTES * 1000 * 60
    const now = new Date()
    if (date < now) {
      return true
    } else {
      log(
        `Not revalidating ${url} because it has been cached within the last ${NO_REVALIDATE_WITHIN_MINUTES} minutes`
      )
      return false
    }
  }
  return true
}
