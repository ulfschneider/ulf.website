---
title: Hanging punctuation
tags: 
  - fonts
  - til
---
Chris Coyier [came up](https://chriscoyier.net/2023/11/27/the-hanging-punctuation-property-in-css/) with `hanging-punctuation`, which is a CSS property currently only supported by Safari.^[[caniuse.com/css-hanging-punctuation](https://caniuse.com/css-hanging-punctuation)] Hanging punctuation means

> … outdenting the lines in a block of text that start or end with certain punctuation marks, usually quotation marks and hyphens. This forms a more even visual edge when compared to the distracting dents created in a text block without hung punctuation.
> <footer>Steve Hickey, <a href="https://stevehickeydesign.com/blog/2012/12/04/hanging-punctuation-with-css/"><cite>Hanging Punctuation With CSS</cite></a></footer>

As Chris states:

<q><strong>I think hanging-punctuation is nice! Just a nice bonus where supported and not a huge deal if it’s not.</strong></q>{.no-indent}

Because it is a cascading property, Chris´ suggestion to start a new project with, is:

```css
html {
  hanging-punctuation: first allow-end last;
}
 ```

I already made this setting for the CSS of this blog.