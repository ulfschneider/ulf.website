---
title: Masonry layout for Safari
tags:
  - css
  - til
---
Masonry layout is available in Safari Technology Preview since Release 163 behind a feature flag. That´s roughly for a year. Apple fixed some issues with Release 171 and 173. Activate it in Safari via **Settings / Feature Flags / CSS Masonry Layout**. This allows the grid CSS to be:

```css
grid-template-rows: masonry;
```

The first example below is using the masonry layout, while the second doesn´t.

<figure>
<img src="/img/design/masonry-layout.jpg">
<figcaption>A grid layout with <code>grid-template-rows: masonry</code></figcaption>
</figure>

<figure>
<img src="/img/design/non-masonry-layout.jpg">
<figcaption>A grid without masonry layout</figcaption>
</figure>




