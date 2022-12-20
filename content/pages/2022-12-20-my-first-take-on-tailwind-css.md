---
title: My first take on Tailwind CSS
tags: [code, css]
draft: true
---
During the last two weeks I switched the CSS for {{site.name}} to [Tailwind CSS](https://tailwindcss.com). Some years ago I got drawn into the concept of utility-first CSS when I saw [Tachyons](http://tachyons.io) for the first time. Utility-first CSS means *self-descriptive, single-purpose CSS classes,* like the below `.center` class:

```css
.center {
	text-align: center;
}
```

A class like `.center` can then be applied to HTML: 

```html
<p class="center">
Here is my paragraph text. It will be centered horizontally.
</p>
``` 

I find utility-first CSS classes particulary useful in conjunction with media-variants. Those variants will reflect on things like screen size or dark mode and light mode. Tailwind has that covered variant prefixes:

```html
<p class="md:center dark:text-">
Here is my paragraph text. It will be centered horizontally.
</p>
```