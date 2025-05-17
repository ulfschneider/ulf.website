---
title: Polishing your typography with line height units
tags: 
  - css
  - code
  - font
  - bookmark
bookmark: true
---
With [<cite>Polishing your typography with line height units</cite>](https://webkit.org/blog/16831/line-height-units/) Jen Simmons is putting a spotlight on the overlooked `lh` unit. It makes a big difference!

> Line height units give us a direct way to tie any size in our layout to the vertical rhythm of the text.
> <footer>Jen Simmons</footer>

I like to apply it in a [flow css](/2025-01-01-my-favourite-3-lines-of-css/) class to set the space between direct siblings:

```css
.flow > * + * {
    margin-block-start: 1em; /* fallback for browsers not supporting the lh unit */
    margin-block-start: 1lh; 
}
```
