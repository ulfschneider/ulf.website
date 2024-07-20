---
title: Prerender pages with Speculation Rules
tags: code
---
Chromium browsers (Firefox and Safari are not on board yet) allow prerendering of future pages that a user is likely to navigate to. Prerending will speed up navigation and can be helpful when used together with [cross-document view transitions](https://ulfschneider.io/2024-05-20-cross-document-transition/), because for a prerendered page the transition does not need to wait for loading and rendering. 

As a web developer, you can insert a JSON configuration in your web pages to define how prerendering should occur. Here is what I´m currently using within the `<head>` of all documents on {{site.name}}:

```js
<script type="speculationrules">
{
  "prerender": [{
    "where": {
      "href_matches": "/*"
    },
    "eagerness": "moderate"
  }]
}
</script>
```

This configuration tells Chromium browsers to prerender any page with *moderate eagerness*. It´s a progressive enhancement, which means it´s not breaking anything for the browsers not supporting the configuration currently.

> The moderate option is a middle ground, and many sites could benefit from the following speculation rule that would prerender a link when holding the pointer over the link for 200 milliseconds (or on the pointerdown event if that is sooner, and on mobile where there is no hover event) as a basic—yet powerful—implementation of speculation rules.
> <footer><a href="https://developer.chrome.com/docs/web-platform/prerender-pages"><cite>Prerender pages in Chrome for instant page navigations</cite></a>, Barry Pollard on developer.chrome.com</footer>

Because prerendering has an impact on bandwith and memory consumption, it should not be overused. The moderate eagerness will automatically limit you to 2 prerendered pages and work First In, First Out, which means <q>after reaching the limit, a new speculation will cause the oldest speculation to be canceled and replaced by the newer one to conserve memory.</q>

> Chrome will also prevent speculations being used in certain conditions including:
> - Save-Data.
> - Energy saver when enabled and on low battery.
> - Memory constraints.
> - When the "Preload pages" setting is turned off (which is also explicitly turned off by Chrome extensions such as uBlock Origin).
> - Pages opened in background tabs.
> - Chrome also does not render cross-origin iframes on prerendered pages until activation.
> <footer><a href="https://developer.chrome.com/docs/web-platform/prerender-pages"><cite>Prerender pages in Chrome for instant page navigations</cite></a>, Barry Pollard on developer.chrome.com</footer>

Speculation Rules can be analyzed in the DevTools pane, you will find it for Chrome under *Application / Background Services / Speculative loads* what page *could* be prerendered and what *has* been prerendered.

<figure class="hero">
<div class="inline-block border border-meta">
<img  src="/img/code/speculation-rules-dev-tools.png" alt="Screenshot of the Chrome DevTools showing 'Speculative loads'.">
</div>
<figcaption>Use DevTools to analyze Speculation Rules for your website</figcaption>
</figure>

You can do *much more* with Speculation Rules, for example change eagerness and define with selectors what links to prerender (or prefetch, which is less than prerendering). To dive deeper, refer to:

- [<cite>Prerender pages in Chrome for instant page navigations</cite>](https://developer.chrome.com/docs/web-platform/prerender-pages) by Barry Pollard on developer.chrome.com
- [<cite>Playing with the Speculation Rules API in the Console</cite>](https://frontendmasters.com/blog/playing-with-the-speculation-rules-api-in-the-console/), by Stoyan Stefanov on frontendmasters.com
- [<cite>Speculation Rules API</cite>](https://github.com/WICG/nav-speculation/blob/main/triggers.md#speculation-rules)

