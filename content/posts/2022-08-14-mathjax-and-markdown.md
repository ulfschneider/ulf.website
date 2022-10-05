---
title: MathJax on the server with Markdown
tags: code
---

Eric Meyer^[See [Recreating "The Effects of Nuclear Weapons" for the Web](https://meyerweb.com/eric/thoughts/2022/08/09/recreating-the-effects-of-nuclear-weapons-for-the-web/).] made me aware of [<cite>MathJax</cite>](https://www.mathjax.org). On their site you find the claim:

<blockquote>
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
var md = require("markdown-it")(),
  mathjax3 = require("markdown-it-mathjax3");

md.use(mathjax3);
```

You can then write in your Markdown MatJax Tex syntax^[On PhysicsOverflow is a [MathJax basic tutorial and quick reference](https://www.physicsoverflow.org/15329/mathjax-basic-tutorial-and-quick-reference) that can serve as a quickstarter.]

```markdown
$$\sqrt{3x-1}+(1+x)^2$$
```

to get the SVG:

$$\sqrt{3x-1}+(1+x)^2$$

That output as you see it is not accessible. markdown-it-mathjax3 can consume the MathJax configuration object but my takes of configuring accessibility support were not successful so far.

==Note on accessibility:== Taniguchi was so kind to activate accessibility by default, starting with version 4.3.2 of markdown-it-mathjax3. There is no need to pass in a MathJax configuration object to activate the function. Assistive MML will be rendered in addition to the SVG output. For the above example that will look like:

```html
<mjx-assistive-mml 
  unselectable="on"
  display="block"
  style="top: 0px; left: 0px; clip: rect(1px, 1px, 1px, 1px); -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; position: absolute; padding: 1px 0px 0px 0px; border: 0px; display: block; overflow: hidden; width: 100%;">
  <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
    <msqrt><mn>3</mn><mi>x</mi><mo>−</mo><mn>1</mn></msqrt><mo>+</mo><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><mi>x</mi><msup><mo stretchy="false">)</mo><mn>2</mn></msup>
  </math>
</mjx-assistive-mml>
```
