---
title: My first take on Tailwind CSS
tags: [code, css]
draft: true
---
During the recent weeks I switched the CSS for {{site.hostname}} to [Tailwind CSS](https://tailwindcss.com). A key concept of Tailwind are *utility-first* CSS classes. Some years ago I got aware of utility-first CSS when I saw [Tachyons](http://tachyons.io), which is buildig up on that concept . The way of working with such CSS classes resonated with me. 

Utility-first CSS means *self-descriptive, single-purpose CSS classes,* like the below .center` class:

```css
.center {
	text-align: center;
}
```

A CSS class like `.center` can then be applied to HTML: 

```html
<p class="center">
Here is my paragraph text. It will be centered horizontally.
</p>
``` 

I find utility-first CSS classes particulary useful in conjunction with media-variants. Those variants will reflect on things like screen size, dark mode, and light mode. Tailwind has that covered with variant prefixes:

```html
<p class="md:center dark:text-">
Here is my paragraph text. It will be centered horizontally.
</p>
```