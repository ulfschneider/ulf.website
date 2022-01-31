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

I didn´t test if it works in all desired scenarios, e.g. on mobile. My favorite solution for this kind of sticky footer, which is robust as far as I can tell, is:

```css
html {
  height: 100%;
}
body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  }
body>main {
  flex-grow: 1;
  flex-shrink: 0;
}
body>footer {
  flex-shrink: 0;
}
```

```html
<body>
<main>
Here is the main content.
</main>
<footer>
Here is the footer content.
</footer>
</body>
```

See the [CodePen](https://codepen.io/ulfschneider/pen/ZEXavJV).