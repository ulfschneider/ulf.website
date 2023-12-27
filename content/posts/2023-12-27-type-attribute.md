---
title: A link can have a type attribute
tags:
  - til
  - code
---
The HTML anchor tag can have a `type` attribute to hint the links mime type. E.g. if your site contains a ling for opening an RSS feed, the anchor tag could look like:

```html
<a href="/feed.xml" type="application/rss+xml">RSS</a>
```

According to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a), the `type` attribute is only a hint and does not have a built-in functionality.