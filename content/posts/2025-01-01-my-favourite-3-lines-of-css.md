---
title: My favourite 3 lines of CSS
abstract: Setting the space between direct siblings
tags:
  - code
  - css
---
```css
.flow > * + * {
  margin-block-start: var(--flow-space, 1em);
}
```

[<cite>My favourite 3 lines of CSS</cite>](https://piccalil.li/blog/my-favourite-3-lines-of-css/) is not only three lines of code to set the space between direct siblings that works left-to-right and right-to-left. Andy Bell has written an extensive explainer for why he is using custom properties, rem values instead of em values, and a fallback em value.