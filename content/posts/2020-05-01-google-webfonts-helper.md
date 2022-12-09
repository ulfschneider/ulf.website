---
title: Google Webfonts Helper
tags: [fonts, star]
---
[Mario Ranftl](https://mranftl.com) has written the [Google Webfonts Helper](https://gwfh.mranftl.com/fonts), which makes self-hosting Google fonts as simple as it  can be. 

The service worker of my website is caching several contents to speed up response to the users. Google fonts are also cached. 

Because those fonts come back as *opaque* http responses from Google, they take a lot of space in the cache and can produce even [other problems](https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests) when using a cache-first strategy. 

<blockquote><p>In order to avoid leakage of cross-domain information, there's significant padding added to the size of an opaque response used for calculating storage quota limits (i.e. whether a QuotaExceeded exception is thrown) and reported by the navigator.storage API.</p><p>The details of this padding vary from browser to browser, but for Google Chrome, this means that the minimum size that any single cached opaque response contributes to the overall storage usage is <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=796060#c17">approximately 7 megabytes</a>.</p><footer>Jeff Posnick on <a href="https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses">stackoverflow</a></footer></blockquote>

Self-hosting Google fonts moves away their opaqueness and makes the network responses being *default* responses. This in return makes the cache entries for those items as small as they should be. A 7KB response is 7KB again, and not 7MB!

The Google Webfonts Helper *helped* me a lot to achieve this.
