---
title: CSS <code>infinity</code>  calc constant
tags: 
  - til
  - css
  - code
---
CSS has an `infinity` constant that can *only* be used inside of a `calc()` statement. It is supported by [modern browsers](https://caniuse.com/mdn-css_types_calc-constant_infinity). For example, to set the z-index to the hightest possible value you could do:

```css
.on-top {
  z-index: calc(infinity);
}
```

There is a negative infinity too: `-infinity`.

`infinity` is not limited to `z-index`. It can be used whenever you need the highest possible number (it´s not infinity really, just a high number). E.g.:

```css
.wide {
	width: calc(infinity * 1px);
}
```

Will Boyd explores the topic much further in his article [<cite>Playing with Infinity in CSS</cite>](https://codersblock.com/blog/playing-with-infinity-in-css/).