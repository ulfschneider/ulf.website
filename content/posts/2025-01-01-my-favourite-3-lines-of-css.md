---
title: Set the space between direct siblings
tags:
  - code
  - css
---
```css
.flow > * + * {
  margin-block-start: var(--flow-space, 1em);
}
```

[<cite>My favourite 3 lines of CSS</cite>](https://piccalil.li/blog/my-favourite-3-lines-of-css/) by Andy Bell is not only three lines of code to set the space between direct siblings that works for any block flow direction, set via [`writing-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode). Andy explains why he is using custom properties, rem values instead of em values, and a fallback em value. It´s worth reading Andy´s 24 Ways article [<cite>Managing Flow and Rhythm with CSS Custom Properties</cite>](https://24ways.org/2018/managing-flow-and-rhythm-with-css-custom-properties/). The text does not use CSS logical properties, because it is dating back to 2018, but is a good companion resource.