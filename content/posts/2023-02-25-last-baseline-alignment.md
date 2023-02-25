---
title: Last baseline alignment
tags: [code, css, til]
---
It´s possible to align text items inside of a flex container to the last line with `align-items: last baseline`. See Rachel´s article [<cite>Last baseline alignment</cite>](https://web.dev/last-baseline/?ref=css-layout-news) on web.dev.

`align-items: baseline`
: When aligning items with `align-items: baseline`, the first baseline of the items you are aligning will align with the first baseline of the other items in the group.

`align-items: last baseline`
: When aligning items with `align-items: last baseline`, the last baseline of the items will align to the last baseline of the baseline sharing group they are part of. 

<p class="codepen" data-height="485" data-default-tab="result" data-slug-hash="wvEzxPV" data-user="ulfschneider" style="height: 485px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/ulfschneider/pen/wvEzxPV">
  Align items to the first and last baseline in a flex container</a> by Ulf Schneider (<a href="https://codepen.io/ulfschneider">@ulfschneider</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
