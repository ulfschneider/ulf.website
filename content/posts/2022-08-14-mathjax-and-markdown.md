---
title: MathJax on the server with Markdown
tags: code
---
Eric Meyer^[See [Recreating “The Effects of Nuclear Weapons” for the Web](https://meyerweb.com/eric/thoughts/2022/08/09/recreating-the-effects-of-nuclear-weapons-for-the-web/)] made me aware of [<cite>MathJax</cite>](https://www.mathjax.org). On their site you find the claim:

<blockquote class="bleed-right">
A JavaScript display engine for mathematics that works in all browsers. 
No more setup for readers. It just works.
<footer><a href="https://www.mathjax.org">MathJax</a></footer>
</blockquote>

While Eric didn´t like that his usage of MathJax required JavaScript on the browser, he was impressed by the powerful syntax. I found – depending on your build setup – it´s possible to run MathJax on the node server without the need of client-side JavaScript. E.g.: I´m using the Static Site Generator 11ty to build this site on the server. I write Markdown and use markdown-it to compile everything into HTML. Like so often, there is a markdown-it plugin that would integrate MathJax into the markdown processing and render the result on the server as SVG – no client Javascript :-). The plugin is named [<cite>markdown-it-mathjax3</cite>](https://www.npmjs.com/package/markdown-it-mathjax3) and it´s made by [Taniguchi Masaya](https://taniguchi.masaya.info). Install it through:

```shell
npm i markdown-it-mathjax3
```

and use it in your markdown-it setup like: 

```javascript
var md = require('markdown-it')(),
    mathjax3 = require('markdown-it-mathjax3');

md.use(mathjax3);
``` 

You can then write in your Markdown 

```markdown
$$\sqrt{3x-1}+(1+x)^2$$
```

to get the SVG:

$$\sqrt{3x-1}+(1+x)^2$$






