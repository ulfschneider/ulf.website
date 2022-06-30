---
title: How we think about browsers
tags: [code, css]
---
The GitHub engineering article [<cite>How we think about browsers</cite>](https://github.blog/2022-06-10-how-we-think-about-browsers/) shows their progressive enhancement attitude. My takes:

- Make fast sites: <q>At GitHub, we believe it’s not fully shipped until it’s fast.<q/> 
- I was not aware of the [optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) and [nullish coalescing (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) operators.
- Particularly the idea of creating a popover menu by leveraging a details element is an interesting twist: <q>With JavaScript disabled, you’re still able to log in, comment on issues and pull requests (although our rich markdown toolbar won’t work), browse source code (with syntax highlighting), search for repositories, and even star, watch, or fork them. <mark>Popover menus even work, thanks to the clever use of the HTML &lt;details> element</mark>.</q> 