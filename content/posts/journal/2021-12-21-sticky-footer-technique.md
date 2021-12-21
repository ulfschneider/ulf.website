---
title: Unobtrusive and smart Sticky Footer
tags: [css, code]
---
It is as simple as

```css
html, body { height: 100%;}

body > footer {
    position: sticky;
    top: 100vh;
}
```

Silvio Rosa made a [CodePen](https://codepen.io/silvio-r/pen/gOxgJbq) about it, which Chris Coyier is [referring to on CSS-Tricks](https://css-tricks.com/a-clever-sticky-footer-technique/).
