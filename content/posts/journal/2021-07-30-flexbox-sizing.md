---
title: Flexbox sizing mental model
tags: [css, code]
---
The following explanation from Anna Monus is taken out of *[A Comprehensive Guide to Flexbox Sizing](https://webdesign.tutsplus.com/tutorials/a-comprehensive-guide-to-flexbox-sizing--cms-31948)* and I find Anna´s text most helpful. Anna has written a multi-part flexbox tutorial, which consists of

1. *[A Comprehensive Guide to Flexbox Alignment](https://webdesign.tutsplus.com/tutorials/a-comprehensive-guide-to-flexbox-alignment--cms-30183)*
2. *[A Comprehensive Guide to Flexbox Ordering & Reordering](https://webdesign.tutsplus.com/tutorials/a-comprehensive-guide-to-flexbox-ordering-reordering--cms-31564)*
3. *[A Comprehensive Guide to Flexbox Sizing](https://webdesign.tutsplus.com/tutorials/a-comprehensive-guide-to-flexbox-sizing--cms-31948)*
4. *[Flexbox vs. CSS Grid: Which Should You Use and When?](https://webdesign.tutsplus.com/articles/flexbox-vs-css-grid-which-should-you-use--cms-30184)*


Below is the default setting for flex.

~~~ css
flex: 0 1 auto;

/* this translates to */
flex-grow: 0;
flex-shrink: 1;
flex-basis: auto;
~~~

The default setting tells the item:
- do not grow if there is available space left
- shrink if there is not enough available space
- size the item initially based on it´s width and height setting, or based on the content if no width/height is set. The item will get shrinked if there is not enough space available.

Anna´s explanation:

<blockquote class="fs">
<p>… Flexbox’s sizing properties allow you to make decisions about three kinds of scenarios:</p>
<ul>
<li><code>flex-grow</code>: how flex items should behave when there’s a surplus of free space (how they should grow).</li>
<li><code>flex-shrink</code>: how flex items should behave when there’s a shortage of free space (how they should shrink).</li>
<li><code>flex-basis</code>: how flex items should behave when there’s exactly as much space as needed.</li>
</ul>
<p>As flexbox is a one-dimensional layout, as opposed to CSS Grid which is two-dimensional, you can allocate free space along the main axis (whether that be top to bottom, bottom to top, left to right, or right to left). You can set the direction of the main axis using the <code>flex-direction</code> property.</p>
<p>… Note that while <code>flex-grow</code> and <code>flex-shrink</code> have relative values (0, 1, 2, etc.), <code>flex-basis</code> always takes an absolute value (<code>px</code>, <code>rem</code>, <code>content</code>, etc.).</p>
<footer>Anna Monus in <cite><a href="https://webdesign.tutsplus.com/tutorials/a-comprehensive-guide-to-flexbox-sizing--cms-31948">A Comprehensive Guide to Flexbox Sizing</a></cite></footer>
</blockquote>



