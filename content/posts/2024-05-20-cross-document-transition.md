---
title: Cross-document view transitions
tags: code
---
Cross-document view transitions (aka multi-page view transitions) arrived in Chrome and Edge 126, which means you can

> animate the transition from one page to another on the same origin (all pages must have the same scheme, hostname, and port, like: https://example.org:443)^[[goo.gle/same-origin](https://goo.gle/same-origin)].

Bramus Van Damme provides an overview in his article [<cite>What´s new in view transitions?</cite>](https://developer.chrome.com/blog/view-transitions-update-io24)

You first have to enable a feature flag in Chrome with `chrome://flags/#view-transition-on-navigation` to make cross-document transitions available. Then, to try out a simple thing, a smooth fade effect from one page to the other with just CSS, you can do:

```css
@view-transition {
  /* required to enable cross-document view transitions*/
  navigation: auto;  
}

::view-transition-old(root) {
  /* transition from the old page */
  animation: fade 0.2s linear forwards;
}

::view-transition-new(root) {
  /* transition to the new page */
  animation: fade 0.4s linear reverse;
}

@keyframes fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

That´s all. The ==meta tag==

```html
<meta name="view-transition" content="same-origin" />
```

which was required previously to enable cross-document view transitions, ==is not necessary anymore==! The enablement of cross-document view transitions is now set with

```css
@view-transition { 
  navigation: auto; 
} 
```

It can make to sense limit the transition to parts of the page, e.g. if you do not want to animate headers and footers but headlines and body text when changing a page. In such a case you can use selectors for scoping. Below I replaced the  `root` selector, which stands for the entire document, with `main`, which, depending on the HTML of your page, could select headings and body text:

```css
::view-transition-old(main) {
  animation: fade 0.2s linear forwards;
}

::view-transition-new(main) {
  animation: fade 0.4s linear reverse;
}
```

